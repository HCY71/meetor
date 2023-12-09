export default function () {
    const blank = ''
    const bg = [
        'background: black',
        'color: white',
        'text-align: center',
        'padding: 4px 10px',
        'line-height: 26px',
        'margin-right: 2px',
        'border-radius: 5px',
        'font-weight: bold'
    ].join(';')
    const dangerBg = [
        'background: #ef4444',
        'color: white',
        'text-align: center',
        'padding: 4px 10px',
        'line-height: 26px',
        'border-radius: 5px',
        'font-weight: bold'
    ].join(';')
    const outline = [
        'background: white',
        'color: black',
        'text-align: center',
        'padding: 4px 10px',
        'line-height: 26px',
        'border-radius: 5px',
        'border: 1px solid black',
        'font-weight: bold'
    ].join(';')
    const dangerLink = [
        'color: black',
        'text-align: center',
        'padding: 4px 10px',
        'line-height: 26px',
        'border-radius: 5px',
        'border: 1px solid #ef4444',
        'font-weight: bold'
    ].join(';')
    const link = [
        'color: black',
        'text-align: center',
        'padding: 4px 10px',
        'line-height: 26px',
        'border-radius: 5px',
        'border: 1px solid black',
        'font-weight: bold'
    ].join(';')

    const info = 'Info'
    const message2 = 'Hi there, welcome to my project!'
    const message3 = 'My name is Erkin.'
    const message4 = 'Go checkout my portfolio at below ↓'
    const message5 = 'NOT THIS, THIS IS DANGEROUS'
    const message6 = 'https://youtu.be/dQw4w9WgXcQ?si=sjT9H7rIPwqN2aGj'
    const message7 = 'LINK'
    const message8 = 'https://erkin-portfolio.com/'
    const message10 = 'Hope you enjoy it!'
    console.log(`%c${info}%c\n%c${message2}%c\n%c${message3}%c\n%c${message4}`, bg, blank, outline, blank, outline, blank, outline)
    console.log(`%c${message5}%c\n%c${message6}`, dangerBg, blank, dangerLink)
    console.log(`%c${info}%c${message7}%c\n%c${message8}`, bg, outline, blank, link)
    console.log(`%c${info}%c\n%c${message10}`, bg, blank, outline)
}