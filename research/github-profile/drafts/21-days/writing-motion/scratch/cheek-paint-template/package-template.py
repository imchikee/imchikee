"""Package existing, separately exported PNG layers as an OpenRaster document."""
from pathlib import Path
from zipfile import ZipFile, ZIP_STORED, ZIP_DEFLATED
from xml.etree.ElementTree import Element, SubElement, tostring

root = Path(__file__).resolve().parent
image = Element('image', {'w': '1316', 'h': '1195', 'name': 'Cheek foreground - paint needed', 'version': '0.0.3'})
stack = SubElement(image, 'stack')
for name, src, visible in [
    ('PAINT HERE - foreground cheek only', 'data/foreground.png', True),
    ('GUIDES ONLY - hide before PNG export', 'data/guides.png', False),
    ('REFERENCE ONLY - hide before PNG export', 'data/reference.png', True),
]:
    SubElement(stack, 'layer', {'name': name, 'src': src, 'x': '0', 'y': '0', 'opacity': '1.0', 'visibility': 'visible' if visible else 'hidden', 'composite-op': 'svg:src-over'})
with ZipFile(root / 'painting-template.ora', 'w') as archive:
    archive.writestr('mimetype', 'image/openraster', compress_type=ZIP_STORED)
    archive.writestr('stack.xml', tostring(image, encoding='utf-8', xml_declaration=True), compress_type=ZIP_DEFLATED)
    for source, target in [
        ('foreground-cheek-template.png', 'data/foreground.png'),
        ('guides-overlay.png', 'data/guides.png'),
        ('reference-0.png', 'data/reference.png'),
        ('reference-0.png', 'mergedimage.png'),
        ('thumbnail.png', 'Thumbnails/thumbnail.png'),
    ]:
        archive.write(root / source, target, compress_type=ZIP_DEFLATED)
print('Packaged painting-template.ora: blank foreground, hidden guides, visible reference')
