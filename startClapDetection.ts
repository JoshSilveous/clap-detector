import mic from 'mic'
import { CLAP_THRESHOLD, CLAP_TIMEOUT, VOLUME_THRESHOLD } from './config'

export function startClapDetection(doubleClapHandler: (resetDetector: () => void) => void) {
	const micInstance = mic({
		rate: '16000',
		channels: '1',
		debug: false,
		exitOnSilence: 6,
		device: 'Analogue 1 + 2',
	})

	const micInputStream = micInstance.getAudioStream()

	let audioBuffer: any[] = []
	micInputStream.on('data', function (data) {
		audioBuffer.push(data)

		// Process the buffer directly as PCM data
		const buffer = Buffer.concat(audioBuffer)
		const pcmData = new Int16Array(
			buffer.buffer,
			buffer.byteOffset,
			buffer.length / Int16Array.BYTES_PER_ELEMENT
		)
		if (!doubleClapDetected) {
			detectClap(pcmData)
		}
		audioBuffer = [] // Clear the buffer after processing
	})

	micInputStream.on('error', function (err) {
		console.error('Error in input stream: ' + err)
	})

	micInstance.start()

	let firstClapDetected = false
	let firstClapWaiting = false
	let doubleClapDetected = false

	function detectClap(pcmData) {
		for (let i = 0; i < pcmData.length; i++) {
			const absData = Math.abs(pcmData[i])
			if (absData > VOLUME_THRESHOLD) {
				if (!firstClapDetected) {
					console.log('first clap detected! applying wait period')
					firstClapDetected = true
					firstClapWaiting = true
					const thisTimeout = setTimeout(() => {
						firstClapWaiting = false
						console.log(
							'firstClapWaiting finished, now accepting input for second clap'
						)
						clearTimeout(thisTimeout)
					}, CLAP_THRESHOLD)

					const thatTimeout = setTimeout(() => {
						firstClapDetected = false
						console.log('first clap timeout expired')
						clearTimeout(thatTimeout)
					}, CLAP_TIMEOUT)
				} else if (firstClapDetected && !firstClapWaiting && !doubleClapDetected) {
					doubleClapDetected = true
					function resetDetector() {
						doubleClapDetected = false
					}
					doubleClapHandler(resetDetector)
				}
			}
		}
	}
}
