import { TestSuite, test } from '../test.deps.js'
import { assertEquals, assert } from '../test.deps.js'
import * as summaryService from '../../services/summaryService.js'
import * as morningService from '../../services/morningService.js'
import * as eveningService from '../../services/eveningService.js'
import { executeQuery } from '../../database/database.js'
import { testDate, testUserId} from '../testVariables.js'


const summaryServiceSuite = new TestSuite({
    name: 'summaryServiceTests:'
})

const startDate = '2020-11-2'
const endDate = '2020-11-5'

const morningReport1 = {
    sleepDuration: 5,
    sleepQuality: 3,
    mood: 2,
    date: startDate,
    userId: testUserId
}
const morningReport2 = {
    sleepDuration: 7,
    sleepQuality: 5,
    mood: 3,
    date: '2020-11-3',
    userId: testUserId
}
const morningReport3 = {
    sleepDuration: 4,
    sleepQuality: 1,
    mood: 2,
    date: endDate,
    userId: testUserId
}
const eveningReport1 = {
    studyTime: 3,
    sportsTime: 2,
    eatingQuality: 3,
    mood: 4,
    date: '2020-11-3',
    userId: testUserId
}
const eveningReport2 = {
    studyTime: 4,
    sportsTime: 1,
    eatingQuality: 5,
    mood: 5,
    date: '2020-11-4',
    userId: testUserId
}
const eveningReport3 = {
    studyTime: 2,
    sportsTime: 3,
    eatingQuality: 1,
    mood: 2,
    date: '2020-11-6',
    userId: testUserId
}
const eveningReport4 = {
    studyTime: 2,
    sportsTime: 3,
    eatingQuality: 1,
    mood: 5,
    date: '2020-11-3',
    userId: 2
}

test(summaryServiceSuite, "get correct average from a given time period", async() => {
    await executeQuery('TRUNCATE morning_reports')
    await executeQuery('TRUNCATE evening_reports')

    const expectedStudyTime = (eveningReport1.studyTime + eveningReport2.studyTime) / 2
    
    const expectedSportsTime = (eveningReport1.sportsTime + eveningReport2.sportsTime) / 2
    
    const expectedSleepDuration = (
        morningReport1.sleepDuration 
        + morningReport2.sleepDuration
        + morningReport3.sleepDuration
    ) / 3

    const expectedSleepQuality = (
        morningReport1.sleepQuality
        + morningReport2.sleepQuality
        + morningReport3.sleepQuality
    ) / 3

    const expectedMood = ( 
        morningReport1.mood
        + morningReport2.mood
        + morningReport3.mood
        + eveningReport1.mood
        + eveningReport2.mood) / 5


    await morningService.addReport(morningReport1)
    await morningService.addReport(morningReport2)
    await morningService.addReport(morningReport3)
    await eveningService.addReport(eveningReport1)
    await eveningService.addReport(eveningReport2)
    await eveningService.addReport(eveningReport3)
    const averages = await summaryService.getAveragesFromPeriod(startDate, endDate, testUserId)
    assertEquals(expectedSleepDuration, Number(averages.sleepDuration))
    assertEquals(expectedSleepQuality, Number(averages.sleepQuality))
    assertEquals(expectedSportsTime, Number(averages.sportsTime))
    assertEquals(expectedStudyTime, Number(averages.studyTime))
    assertEquals(expectedMood, Number(averages.mood))
});

test(summaryServiceSuite, "checks if a time period has or does not have entries", async() => {
    const result1 = await summaryService.periodHasEntries(startDate, endDate, testUserId)
    assertEquals(result1, true)
    const result2 = await summaryService.periodHasEntries('2020-10-1', '2020-10-5', testUserId)
    assertEquals(result2, false)
});

test(summaryServiceSuite, "gets average mood for a date", async() => {
    await eveningService.addReport(eveningReport4)
    const result1 = await summaryService.getAverageMoodForDate('2020-11-3')
    assertEquals(result1, 4)
    const result2 = await summaryService.getAverageMoodForDate('2020-10-1')
    assertEquals(result2, null)
});

test(summaryServiceSuite, "gets report amount from period", async() => {
    const result = await summaryService.getReportAmountFromPeriod(startDate, endDate)
    assertEquals(result, 6)
});

