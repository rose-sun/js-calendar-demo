var currentTime = new Date()
render(currentTime)

g('#prevMonth').onclick = () => {
    const firstDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1)
    render(new Date(firstDay - 86400 * 1000))
}
g('#nextMonth').onclick = () => {
    const firstDayOfNextMonth = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 1)
    render(firstDayOfNextMonth)
}
g('#today').onclick = () => {
    render(new Date())
}

function render(time) {
    const year = time.getFullYear()
    const month = time.getMonth() + 1  // month从0开始
    currentTime = time
    initTime()
    generateDays()

    function initTime() {
        const time = g('#time')
        time.textContent = `${year}年${month}月`
    }

    function generateDays() {
        const days = g('#days')
        days.innerHTML = ''
        // 月初几号
        const firstDayOfCurrentMonth = new Date(year, month - 1, 1)  // 年月日生成每月的第一天
        // 月初星期几
        const weekdayOfFirstDayOfCurrentMonth = firstDayOfCurrentMonth.getDay()

        // 月末几号
        const lastDayOfCurrentMonth = new Date(new Date(year, month - 1 + 1, 1) - 86400 * 1000)
        const dayOfLastDayOfCurrentMonth = lastDayOfCurrentMonth.getDate()
        // 月末星期几
        const weekdayOfLastDayOfCurrentMonth = lastDayOfCurrentMonth.getDay()
        // 这个月有几天
        const sumOfDay = dayOfLastDayOfCurrentMonth
        const now = new Date()
        let selectedLi
        let n = 0  // 计数
        const fragment = document.createDocumentFragment()

        // 铺垫前面
        for (let i = 1; i < weekdayOfFirstDayOfCurrentMonth; i++) {
            const li = document.createElement('li')
            const d = new Date(firstDayOfCurrentMonth - 86400 * 1000 * i)
            li.textContent = d.getDate()
            li.classList.add("calendar-days-disabled")
            fragment.prepend(li)
            n += 1
        }

        // 创建日历
        for (let i = 1; i <= sumOfDay; i++) {
            const li = document.createElement('li')
            li.textContent = i
            console.log(i)
            if (i === now.getDate() && month === now.getMonth() + 1 && year === now.getFullYear()) {
                li.classList.add("calendar-days-today")
            }
            li.onclick = () => {
                if (selectedLi) { selectedLi.classList.remove("calendar-days-selected") }
                li.classList.add("calendar-days-selected")
                selectedLi = li
                if (events) {
                    const fragment = document.createDocumentFragment()
                    events.map(event => {
                        const div = document.createElement('div')
                        div.classList.add("events-item")
                        div.textContent = event
                        fragment.append(div)
                    })
                    g('#events').innerHTML = ""
                    g('#events').append(fragment)
                } else {
                    g('#events').innerHTML = '<div>无</div>'
                }
            }
            const key = `${year}-${month}-${i}`
            const events = window.data[key]
            if (events) {
                li.classList.add("calendar-days-hasEvents")
            }
            fragment.append(li)
            n += 1
        }

        // 铺垫后面
        let i = weekdayOfLastDayOfCurrentMonth + 1
        for (let j = 0; j < 42 - n; j++) {
            const delta = i - weekdayOfLastDayOfCurrentMonth
            const li = document.createElement('li')
            // 先通过减0将lastDayOfCurrentMonth转为数字，再做加法，不然默认是字符串
            const d = new Date(lastDayOfCurrentMonth - 0 + 86400 * 1000 * delta)
            li.textContent = d.getDate()
            li.classList.add("calendar-days-disabled")
            fragment.append(li)
            i += 1
        }
        days.append(fragment)
    }
}

// 帮助函数
// 获取一个元素
function g(selector) {
    return document.querySelector(selector)
}
// 获取多个元素
function gs(selector) {
    return document.querySelectorAll(selector)
}
