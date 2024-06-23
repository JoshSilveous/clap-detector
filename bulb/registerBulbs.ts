'use server'

import { delay } from '../util/delay'
import { bulbs } from './bulb'

export async function awaitBulbRegistration(expectedAliases: string[]) {
	let allBulbsAreRegistered = false

	console.time('all bulbs are now registered')
	let count = 0
	while (!allBulbsAreRegistered) {
		count++
		await delay(250)
		const registered = bulbs.map((bulb) => bulb.alias)
		console.log(count, 'registered', registered)
		allBulbsAreRegistered = expectedAliases.every((expectedAlias) => {
			return registered.includes(expectedAlias)
		})
	}
	console.timeEnd('all bulbs are now registered')
}
