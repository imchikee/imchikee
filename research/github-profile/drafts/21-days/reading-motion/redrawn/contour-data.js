// The same authored patch and boundary band are used by the preview and animation.
const contourPatches=[
 {name:'正面原稿',base:'../model/reading-soft-v1.png',patch:'redrawn/contour-patch-front-v1.png',band:[[140,0],[142,20],[164,42],[155,58],[121,75],[88,98],[58,125],[35,153],[17,183],[0,215]]},
 {name:'中间姿态',base:'redrawn/mid-key-soft-v1.png',patch:'redrawn/contour-patch-mid-v1.png',band:[[160,0],[162,24],[182,44],[160,61],[127,79],[95,104],[63,131],[37,158],[17,188],[0,218]]},
 {name:'低头姿态',base:'redrawn/down-key-soft-v1.png',patch:'redrawn/contour-patch-down-v2.png',band:[[175,0],[175,23],[195,45],[167,64],[132,82],[99,106],[65,134],[40,161],[18,191],[0,220]]}
];
function composeContour(image,patchImage,headImage,spec){
 const create=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
 const patch=create(270,240),p=patch.getContext('2d');p.drawImage(patchImage,0,0,270,240);
 const band=create(270,240),b=band.getContext('2d');b.filter='blur(2px)';b.strokeStyle='#fff';b.lineWidth=50;b.lineJoin=b.lineCap='round';b.beginPath();spec.band.forEach(([x,y],j)=>b[j?'lineTo':'moveTo'](x,y));b.stroke();
 const frame=create(270,240),f=frame.getContext('2d');f.filter='blur(3px)';f.fillStyle='#fff';f.fillRect(6,6,258,228);b.globalCompositeOperation='destination-in';b.drawImage(frame,0,0);
 p.globalCompositeOperation='destination-in';p.drawImage(band,0,0);
 const full=create(1316,1195),c=full.getContext('2d');c.drawImage(image,0,0,1316,1195);c.drawImage(patch,200,490);
 const head=create(850,530),h=head.getContext('2d');h.drawImage(headImage,0,0,850,530);
 const edge=create(850,530),e=edge.getContext('2d');e.filter='blur(2px)';e.strokeStyle='#fff';e.lineWidth=70;e.lineCap=e.lineJoin='round';
 for(const line of spec.edges){e.beginPath();line.forEach(([x,y],j)=>e[j?'lineTo':'moveTo'](x-170,y-280));e.stroke();}
 e.filter='none';e.globalCompositeOperation='destination-out';e.fillStyle='#fff';
 for(const line of [spec.cap,spec.whiskers,[[477,744],[500,723],[540,713],[630,720],[720,740],[773,768],[827,727],[1010,670],[1034,683],[1051,700],[1030,760],[994,920],[968,959],[770,991],[470,960],[487,841]]]){e.filter=line===spec.whiskers?'blur(5px)':'none';e.beginPath();line.forEach(([x,y],j)=>e[j?'lineTo':'moveTo'](x-170,y-280));e.closePath();e.fill();if(line!==spec.cap&&line!==spec.whiskers){e.lineWidth=16;e.strokeStyle='#fff';e.stroke();}}
 h.globalCompositeOperation='destination-in';h.drawImage(edge,0,0);c.drawImage(head,170,280);return full;
}

// Four visible fur arcs: left cheek, left ear, right ear, right cheek.
Object.assign(contourPatches[0],{headPatch:'redrawn/contour-head-front-v1.png',cap:[[480,360],[533,328],[613,306],[699,323],[721,358],[734,400],[778,415],[792,444],[776,460],[725,441],[655,466],[557,472],[518,454],[500,432]],whiskers:[[795,615],[900,615],[900,705],[795,705]],edges:[
 [[215,782],[211,734],[229,682],[261,623],[303,580],[348,550],[382,532]],
 [[382,534],[350,510],[330,474],[332,433],[350,400],[386,377],[425,375],[459,393],[478,420]],
 [[775,390],[803,385],[836,403],[854,435],[854,469],[840,498],[820,515]],
 [[824,516],[852,545],[867,572],[879,598],[903,626],[926,654],[939,684],[945,712]]
]});
Object.assign(contourPatches[1],{headPatch:'redrawn/contour-head-mid-v1.png',cap:[[497,365],[556,330],[646,307],[718,330],[748,380],[760,437],[800,455],[818,483],[806,499],[758,481],[687,503],[581,505],[542,480],[519,446]],whiskers:[[802,637],[904,637],[904,714],[802,714]],edges:[
 [[217,790],[218,745],[236,692],[270,633],[311,588],[359,555],[397,533]],
 [[397,534],[361,512],[344,474],[347,431],[366,399],[401,378],[439,377],[475,397],[496,430]],
 [[802,398],[832,396],[861,417],[878,452],[875,487],[860,514],[841,531]],
 [[844,531],[868,558],[881,588],[892,614],[916,643],[936,675],[947,702],[950,723]]
]});
Object.assign(contourPatches[2],{headPatch:'redrawn/contour-head-down-v1.png',cap:[[516,375],[572,339],[670,312],[747,344],[774,394],[787,459],[821,478],[839,514],[827,532],[774,514],[707,534],[612,535],[570,510],[540,472]],whiskers:[[808,660],[910,660],[910,735],[808,735]],edges:[
 [[221,798],[223,750],[244,699],[278,639],[321,592],[372,557],[416,537]],
 [[416,539],[381,521],[361,486],[361,443],[380,411],[414,389],[452,383],[489,401],[514,434]],
 [[829,418],[860,412],[888,434],[902,465],[898,501],[884,529],[863,550]],
 [[866,550],[887,578],[898,605],[909,631],[928,659],[945,690],[954,718]]
]});
