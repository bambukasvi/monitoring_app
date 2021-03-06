import { getAverageMoodForDate } from '../../services/summaryService.js'
import { getToday, getYesterday  } from '../../utils.js'

const showMain = async({render, session}) => {
    const loggedIn = await session.get('authenticated')
    let data = {
        loggedIn
    }
    let todaysMood = await getAverageMoodForDate(getToday())
    let yesterdaysMood = await getAverageMoodForDate(getYesterday())
    let trend = null
    if (todaysMood && yesterdaysMood) {
        if (todaysMood > yesterdaysMood) {
            trend = 'Things look bright today'
        } else {
            trend = 'Things look gloomy today'
        }
    }
    if (!todaysMood) {
        todaysMood = 'No data for today'
    }
    if (!yesterdaysMood) {
        yesterdaysMood = 'No data for yesterday'
    }
    if (!trend) {
        trend = 'Cannot show trend if no data for both today and yesterday'
    }
    data = {
        ...data,
        todaysMood,
        yesterdaysMood,
        trend
    }
    if (loggedIn) {
        const user = await session.get('user')
        data.userEmail = user.email
        render('index.ejs', data)
    } else {
        render('index.ejs', data);
    }
};
  
export { showMain };