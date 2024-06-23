import { powerOffBulb, toggleBulb } from './bulb/bulbPower'
import { awaitBulbRegistration } from './bulb/registerBulbs'
import { startClapDetection } from './startClapDetection'

async function main() {
	const bulbs = ['Backlight', 'Main']
	await awaitBulbRegistration(bulbs)
	startClapDetection(doubleClapHandler)

	function doubleClapHandler(resetDetector: () => void) {
		console.log('double clap detected!')

		const promiseArray: any[] = []

		bulbs.forEach((bulbAlias) => {
			console.log('toggling bulb', bulbAlias)
			promiseArray.push(toggleBulb(bulbAlias))
		})

		Promise.all(promiseArray).then(() => {
			resetDetector()
		})
	}
}

main()
