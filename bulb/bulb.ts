import { Bulb, Client } from 'tplink-smarthome-api'

const client = new Client()

export const bulbs: Bulb[] = []

client.startDiscovery().on('device-new', (device) => {
	console.log(device.deviceType)
	if (device.deviceType === 'bulb') {
		bulbs.push(device as Bulb)
	}
})
console.log('registering bulbs')

export function getBulb(alias: string): Bulb {
	let foundBulb: Bulb | undefined

	bulbs.some((bulb) => {
		if (bulb.alias === alias) {
			foundBulb = bulb
			return true
		}
	})

	if (foundBulb !== undefined) {
		return foundBulb
	} else {
		console.log(
			'current bulbs:',
			bulbs.map((bulb) => bulb.alias)
		)
		throw new Error(`Bulb "${alias}" requested, but not found.`)
	}
}
