import { ref, watch, onMounted } from 'vue'

export default function models(props, emit) {
    const displayValue = ref(0)
    const animating = ref(false)

    const easingFns = {
        linear: (t) => t,
        easeOut: (t) => 1 - Math.pow(1 - t, 3),
        easeInOut: (t) => t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(2 * t - 2, 2) / 2
    }

    const animate = () => {
        if (animating.value) return
        animating.value = true
        const startVal = displayValue.value
        const startTime = performance.now()
        const easeFn = easingFns[props.easing]

        const step = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / props.duration, 1)
            const eased = easeFn(progress)
            displayValue.value = Math.floor(startVal + (props.target - startVal) * eased)

            if (progress < 1) {
                requestAnimationFrame(step)
            } else {
                displayValue.value = props.target
                animating.value = false
                emit('finished')
            }
        }
        requestAnimationFrame(step)
    }

    watch(() => props.target, () => {
        if (props.start) animate()
    }, { immediate: true })

    onMounted(() => {
        if (props.start) animate()
    })

    return {
        displayValue
    }
}