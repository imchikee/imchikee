import fs from 'node:fs';
import path from 'node:path';

const [work] = process.argv.slice(2);
const width = 352;
const height = 264;
const size = width * height;
const paintings = ['a', 'b'].map(name => {
  const pixels = fs.readFileSync(path.join(work, name + '.rgba'));
  const detail = fs.readFileSync(path.join(work, name + '-detail.rgb'));
  const edges = Array.from({length: height}, (_, y) => {
    for (let x = 1; x < 86; x++) {
      const alpha = pixels[(y * width + x) * 4 + 3];
      if (alpha >= 128) {
        const previous = pixels[(y * width + x - 1) * 4 + 3];
        return x - (alpha - 128) / (alpha - previous);
      }
    }
    return 86;
  });
  return {pixels, detail, edges};
});
const frames = path.join(work, 'patches');
fs.mkdirSync(frames, {recursive: true});

// Landmarks in the two complete paintings: still cheek, upper seam, elbow,
// cuff and tool-side anchors. Paired cross sections carry the same vertical
// motion weight so that a change of nib height does not pinch their thickness.
const landmarks = [
  [[0,0],[0,0],0], [[351,0],[351,0],0], [[351,263],[351,263],0], [[0,263],[0,263],0],
  [[64,31],[64,31],0], [[110,45],[110,45],0], [[190,34],[190,34],0],
  [[58,55],[58,55],0], [[76,68],[75,68],0], [[104,81],[103,81],0.02],
  [[140,102],[128,101],0.47], [[164,136],[149,138],0.79],
  [[45,89],[39,87],0.10], [[34,126],[23,126],0.16], [[38,155],[23,155],0.24],
  [[54,181],[40,184],0.30], [[77,196],[63,200],0.42], [[106,204],[92,213],0.47],
  [[74,151],[61,153],0.25], [[104,143],[92,144],0.48], [[121,164],[108,167],0.66],
  [[130,198],[112,206],0.79], [[155,216],[133,220],1],
  [[171,220],[149,223],1], [[187,214],[168,218],1],
  [[198,209],[179,210],1], [[211,191],[192,195],1],
  [[220,175],[199,177],1], [[210,160],[187,161],1], [[191,151],[169,148],1],
  [[165,147],[150,146],1], [[149,170],[128,171],1], [[172,188],[152,191],1],
  [[192,180],[173,182],1],
  [[140,67],[124,70],1], [[153,70],[136,71],1], [[146,84],[131,84],1],
  [[159,100],[142,100],1], [[175,130],[156,130],1], [[187,144],[168,146],1],
  [[216,198],[194,199],1], [[208,213],[183,213],1], [[225,219],[201,219],1],
  [[227,233],[202,236],1], [[234,247],[208,250],1],
];
const lerp = (a,b,t) => a + (b-a)*t;
const point = (a,b,t) => [lerp(a[0],b[0],t),lerp(a[1],b[1],t)];
const ease = t => t*t*(3-2*t);
const clamp = (t,lo=0,hi=1) => Math.max(lo,Math.min(hi,t));
const cross = (a,b,c) => (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);

function triangulate(input) {
  const points = [...input, [-800,-600], [1250,-600], [160,1600]];
  const n = input.length;
  let triangles = [[n,n+1,n+2]];
  for (let i=0;i<n;i++) {
    const border = new Map();
    triangles = triangles.filter(ids => {
      const [x,y] = points[i];
      const [a,b,c] = ids.map(j=>[points[j][0]-x,points[j][1]-y]);
      const winding = cross(a,b,c);
      const inCircle = (a[0]**2+a[1]**2)*(b[0]*c[1]-b[1]*c[0])
        -(b[0]**2+b[1]**2)*(a[0]*c[1]-a[1]*c[0])
        +(c[0]**2+c[1]**2)*(a[0]*b[1]-a[1]*b[0]);
      if (winding*inCircle <= 1e-7) return true;
      ids.forEach((a,j) => {
        const b=ids[(j+1)%3];
        const key=a<b ? a+':'+b : b+':'+a;
        if (border.has(key)) border.delete(key);
        else border.set(key,[a,b]);
      });
      return false;
    });
    for (const [a,b] of border.values()) triangles.push([a,b,i]);
  }
  return triangles.filter(triangle=>triangle.every(i=>i<n));
}

const keys = [0,1].map(j=>landmarks.map(p=>p[j]));
const mesh = triangulate(landmarks.map(([a,b])=>point(a,b,.5)));
const tipA = keys[0].at(-1);
const tipB = keys[1].at(-1);
const strokes = [
  {start:.50,end:.88,a:tipA,b:[229,237]},
  {start:1.04,end:1.39,a:[237,240.5],b:[223,242]},
  {start:1.65,end:1.73,a:[216,236],b:[215.6,237.1]},
  {start:1.94,end:2.26,a:[217,241],b:[213,247]},
];
const finish = [208,243];
const stop = 3.02;

function pose(t) {
  for (let i=0;i<strokes.length;i++) {
    const {start,end,a,b} = strokes[i];
    if (t < start) {
      if (!i) return {tip:a, lift:0};
      const prev=strokes[i-1];
      const u=clamp((t-prev.end)/(start-prev.end));
      const tip=point(prev.b,a,ease(u));
      const lift=(i===2 ? 5.6 : 4.4)*Math.sin(Math.PI*u)**2;
      return {tip:[tip[0],tip[1]-lift], lift};
    }
    if (t <= end) return {tip:point(a,b,ease((t-start)/(end-start))),lift:0};
  }
  const last=strokes.at(-1);
  const u=ease(clamp((t-last.end)/(stop-last.end)));
  const rise=ease(clamp((t-last.end)/.31));
  const settle=ease(clamp((t-2.57)/(stop-2.57)));
  const lift=7*rise-3*settle;
  return {tip:[lerp(last.b[0],finish[0],u),last.b[1]-lift],lift};
}

function sample(paint,x,y,out) {
  x=clamp(x,0,width-1.001);
  y=clamp(y,0,height-1.001);
  const x0=Math.floor(x), y0=Math.floor(y), d=x-x0, e=y-y0;
  const index=(y0*width+x0)*4;
  const stride=width*4;
  const j=[index,index+4,index+stride,index+stride+4];
  const w=[(1-d)*(1-e),d*(1-e),(1-d)*e,d*e];
  out.fill(0);
  for(let k=0;k<4;k++) {
    const alpha=paint.pixels[j[k]+3]*w[k]/255;
    const detailIndex=j[k]/4*3;
    for(let c=0;c<3;c++) {
      out[c]+=paint.pixels[j[k]+c]*alpha;
      out[c+4]+=(paint.detail[detailIndex+c]-128)*alpha;
    }
    out[3]+=alpha;
  }
  out[7]=x-lerp(paint.edges[y0],paint.edges[y0+1],e);
}

function actor(points,mix) {
  const pixels=Buffer.alloc(size*4);
  const a=new Float64Array(8), b=new Float64Array(8);
  const transition=ease(clamp(mix/.18))*ease(clamp((1-mix)/.18));
  for (const ids of mesh) {
    const [p,q,r]=ids.map(i=>points[i]);
    const [m,n,o]=ids.map(i=>keys[0][i]);
    const [u,v,w]=ids.map(i=>keys[1][i]);
    const area=cross(p,q,r);
    if (area*cross(m,n,o)<=0 || area*cross(u,v,w)<=0)
      throw Error('Folded pose triangle '+JSON.stringify({ids,p,q,r,m,n,o,u,v,w}));
    for(let y=Math.max(0,Math.ceil(Math.min(p[1],q[1],r[1]))); y<=Math.min(height-1,Math.max(p[1],q[1],r[1])); y++) {
      for(let x=Math.max(0,Math.ceil(Math.min(p[0],q[0],r[0]))); x<=Math.min(width-1,Math.max(p[0],q[0],r[0])); x++) {
        const beta=((x-p[0])*(r[1]-p[1])-(y-p[1])*(r[0]-p[0]))/area;
        const gamma=((q[0]-p[0])*(y-p[1])-(q[1]-p[1])*(x-p[0]))/area;
        const alpha=1-beta-gamma;
        if (Math.min(alpha,beta,gamma)<-1e-8) continue;
        sample(paintings[0],alpha*m[0]+beta*n[0]+gamma*o[0],alpha*m[1]+beta*n[1]+gamma*o[1],a);
        sample(paintings[1],alpha*u[0]+beta*v[0]+gamma*w[0],alpha*u[1]+beta*v[1]+gamma*w[1],b);
        const j=(y*width+x)*4;
        const opacity=lerp(a[3],b[3],mix);
        if (opacity < 1/255) continue;

        // Keep the original painted contact shadow beneath the cheek through
        // the pose change. Fall off before reaching the mobile forearm.
        const distance=Math.hypot((x-80)/76,(y-83)/47);
        const cheek=1-ease(clamp((distance-.39)/.55));
        const paintMix=mix*(1-.91*cheek*a[3]);
        const paintOpacity=lerp(a[3],b[3],paintMix);

        // Interpolate body lighting, retaining one painting's brush detail
        // through the middle instead of averaging two unaligned fur textures.
        const detailMix=lerp(paintMix,ease(clamp((paintMix-.56)/.42)),
                             ease(clamp((Math.min(a[3],b[3])-.86)/.14)));
        for(let c=0;c<3;c++) {
          const color=lerp(a[c],b[c],paintMix)
            +(detailMix-paintMix)*(b[c+4]-a[c+4]);
          pixels[j+c]=Math.round(clamp(color/paintOpacity,0,255));
        }

        // Interpolate one outer elbow contour rather than letting two
        // partly transparent edges take turns across the silhouette.
        const edgeZone=transition*ease(clamp((y-93)/20))
          *ease(clamp((189-y)/18))*ease(clamp((71-x)/18));
        const edge=ease(clamp((lerp(a[7],b[7],mix)+.95)/1.9));
        pixels[j+3]=Math.round(lerp(opacity,edge,edgeZone)*255);
      }
    }
  }
  return pixels;
}

const times=[];
for(let frame=0;frame<192;frame++) {
  const t=frame/60;
  const {tip,lift}=pose(t);
  const ink=strokes.filter(s=>t>=s.start).map(s=>[s.a,point(s.a,s.b,ease(clamp((t-s.start)/(s.end-s.start))))]);
  const u=clamp((tipA[0]-tip[0])/(tipA[0]-tipB[0]));
  const nominal=point(tipA,tipB,u);
  const points=landmarks.map(([a,b,weight])=>{
    const p=point(a,b,u);
    return [p[0]+(tip[0]-nominal[0])*weight,p[1]+(tip[1]-nominal[1])*weight];
  });
  if (Math.hypot(tip[0]-points.at(-1)[0],tip[1]-points.at(-1)[1])>1e-6) throw Error('Nib tracking');
  const prefix=path.join(frames,String(frame).padStart(3,'0'));
  if (t>.38) fs.writeFileSync(prefix+'.rgba',actor(points,ease(u)));
  times.push({t,tip,lift,u,ink,active:t>.38,blend:ease(clamp((t-.38)/.17))});
}
fs.writeFileSync(path.join(work,'timeline.json'),JSON.stringify(times));
