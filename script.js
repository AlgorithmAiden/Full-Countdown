//setup the canvas
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

/**make the canvas always fill the screen**/;
(function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    window.onresize = resize
})()

//for this code (as in code before this line), I almost always use the same stuff, so its going to stay here

//for getting time as a nice string
const targetDate = localStorage.getItem('targetDate') ?? 'April 22, 2024 00:00:00'
const targetTime = new Date(targetDate)

//reset the date if the current one is invalid
if (!(targetTime - 1 > 0 || targetTime - 1 <= 0)) {
    localStorage.clear('targetDate')
    window.location.reload()
}
function getTime(offset = 0) {

    function cfs(n) { return n != 1 ? 'S' : '-' }
    function cfp(n) { return n < 10 ? '-' : '' }

    let remainingTime = targetTime - Date.now() + offset
    const secondTime = 1000
    const minuteTime = secondTime * 60
    const hourTime = minuteTime * 60
    const dayTime = hourTime * 24
    const weekTime = dayTime * 7
    const monthTime = dayTime * 30
    const yearTime = monthTime * 12
    const years = Math.floor(remainingTime / yearTime)
    remainingTime %= yearTime
    const months = Math.floor(remainingTime / monthTime)
    remainingTime %= monthTime
    const weeks = Math.floor(remainingTime / weekTime)
    remainingTime %= weekTime
    const days = Math.floor(remainingTime / dayTime)
    remainingTime %= dayTime
    const hours = Math.floor(remainingTime / hourTime)
    remainingTime %= hourTime
    const minutes = Math.floor(remainingTime / minuteTime)
    remainingTime %= minuteTime
    const seconds = Math.floor(remainingTime / secondTime)
    remainingTime %= secondTime
    let out = ''
    out += `${cfp(years)}${years}-YEAR${cfs(years)}`
    out += `-${cfp(months)}${months}-MONTH${cfs(months)}`
    out += `-${cfp(weeks)}${weeks}-WEEK${cfs(weeks)}`
    out += `-${cfp(days)}${days}-DAY${cfs(days)}`
    out += `-${cfp(hours)}${hours}-HOUR${cfs(hours)}`
    out += `-${cfp(minutes)}${minutes}-MINUTE${cfs(minutes)}`
    out += `-${cfp(seconds)}${seconds}-SECOND${cfs(seconds)}`
    return out
}
const textLength = getTime().length

//set the number of rows
const rowSize = canvas.width / textLength
const rows = canvas.height / rowSize
const target = Math.round(rows / 2)

    ;//the render loop
(function render() {
    //clear the screen
    ctx.fillStyle = 'rgb(0,0,0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //render the text
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = `${rowSize}px Georgia`
    const offset = (canvas.width - rowSize * textLength) / 2
    const greenGradient = ctx.createLinearGradient(canvas.width / 2, 0, canvas.width / 2, canvas.height)
    greenGradient.addColorStop(0, 'rgb(0,0,0)')
    greenGradient.addColorStop(.5, 'rgb(0,200,0)')
    greenGradient.addColorStop(1, 'rgb(0,0,0)')
    for (let index = 0; index < rows; index++) {
        if (index - target == 0) ctx.fillStyle = 'rgb(0,255,0)'
        else ctx.fillStyle = greenGradient
        const text = getTime((index - target) * 1000).split('')
        for (let subindex = 0; subindex < text.length; subindex++) {
            ctx.fillText(text[subindex], offset + subindex * rowSize, index * rowSize + rowSize / 2)
        }
    }
    requestAnimationFrame(render)
})()

//listen for clicks
let textOpen = false
let clicks = 0
document.addEventListener('click', e => {
    if (!textOpen) {
        clicks++
        setTimeout(() => clicks--, 1000)
        if (clicks >= 3) {
            textOpen = true

            //create a text element
            const newInput = document.createElement('input')
            newInput.value = targetDate
            newInput.type = 'text'
            newInput.id = 'textInput'

            //style the input to fill the screen and appear above the canvas
            newInput.style.position = 'absolute'
            newInput.style.top = '0'
            newInput.style.left = '0'
            newInput.style.width = '100%'
            newInput.style.height = '100%'
            newInput.style.zIndex = '999'

            //set the theme
            newInput.style.backgroundColor = 'black'
            newInput.style.color = 'darkgreen'
            newInput.style.fontSize = '24px'
            newInput.style.textAlign = 'center'

            //add it
            document.body.appendChild(newInput)
        }
    }
})

//listen for keys
document.addEventListener('keypress', e => {
    //if the text box is open and the key is enter
    if (textOpen && e.key == 'Enter') {
        //set the new date, and reload
        localStorage.setItem('targetDate', (document.getElementById('textInput').value))
        window.location.reload()
    }
})