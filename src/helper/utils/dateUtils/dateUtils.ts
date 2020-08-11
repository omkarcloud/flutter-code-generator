

export function diffDate(small: Date, big: Date = new Date() //current date time 
) {
    // To calculate the time difference of two dates 
    const Difference_In_Time = big.getTime() - small.getTime()

    // To calculate the no. of days between two dates 
    const Days = Difference_In_Time / (1000 * 3600 * 24)
    const Mins = Difference_In_Time / (60 * 1000)
    const Hours = Mins / 60

    const diffDate = new Date(Difference_In_Time)

    // console.log({ date: small, now: big, diffDate, Difference_In_Days: Days, Difference_In_Mins: Mins, Difference_In_Hours: Hours })

    var result = ''

    if (Mins < 60) {
        result = Mins + 'm'
    } else if (Hours < 24) result = diffDate.getMinutes() + 'h'
    else result = Days + 'd'

    return { result, Days, Mins, Hours }
}

export function diffDateToStr(small: Date, big: Date = new Date() //current date time 
) {
    return diffDate(small, big).result + ' ago'
}

export function getFixedDate() {
    return new Date('06/28/2020')
}
