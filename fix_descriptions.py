placeholder = '{' + 'ADDRESS' + '}'

with open('server/index.js', 'r') as f:
    content = f.read()

content = content.replace(
    'at ' + placeholder + '. Includes title search',
    'at 14 Maple Grove, Sydney. Includes title search'
)
content = content.replace(
    'in ' + placeholder + ' CBD. Matter resolved',
    'in Melbourne CBD. Matter resolved'
)
content = content.replace(
    'in ' + placeholder + '. Matter resolved',
    'in Melbourne CBD. Matter resolved'
)

with open('server/index.js', 'w') as f:
    f.write(content)

print('Done')
