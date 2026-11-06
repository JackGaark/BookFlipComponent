/**
 * @typedef {'hover' | 'click' | 'slider'} Trigger
 * @typedef {{status: 'idle' | 'flipping' | 'gone', run: number, trigger: Trigger | null,
 * held: boolean, moved: boolean, reducedMotion: boolean, finePointer: boolean}} FlipState
 * @typedef {{type: 'environment', reducedMotion: boolean, finePointer: boolean} |
 * {type: 'hover' | 'click' | 'sliderGrab' | 'sliderMove' | 'sliderRelease' | 'unmount'} |
 * {type: 'finished' | 'cancelled', run: number}} FlipAction
 */

/** @type {FlipState} */
export const initialBookFlip = {
	status: 'idle',
	run: 0,
	trigger: null,
	held: false,
	moved: false,
	reducedMotion: true,
	finePointer: false
};

/** @param {FlipState} state @param {Trigger} trigger @returns {FlipState} */
function begin(state, trigger) {
	return { ...state, status: 'flipping', run: state.run + 1, trigger, moved: false };
}

/** @param {FlipState} state @param {FlipAction} action @returns {FlipState} */
export function bookFlip(state, action) {
	if (state.status === 'gone') return state;
	switch (action.type) {
		case 'environment':
			return state.reducedMotion === action.reducedMotion &&
				state.finePointer === action.finePointer
				? state
				: { ...state, reducedMotion: action.reducedMotion, finePointer: action.finePointer };
		case 'hover':
			return state.status === 'idle' && !state.reducedMotion && state.finePointer
				? begin(state, 'hover')
				: state;
		case 'click':
			return state.status === 'idle' ? begin(state, 'click') : state;
		case 'sliderGrab':
			return state.held ? state : { ...state, held: true };
		case 'sliderMove':
			if (state.status === 'idle') return begin(state, 'slider');
			return state.held && !state.moved ? { ...state, moved: true } : state;
		case 'sliderRelease':
			return state.held || state.moved ? { ...state, held: false, moved: false } : state;
		case 'finished':
		case 'cancelled':
			if (state.status !== 'flipping' || action.run !== state.run) return state;
			if (action.type === 'finished' && state.held && state.moved) return begin(state, 'slider');
			return { ...state, status: 'idle', trigger: null, moved: false };
		case 'unmount':
			return { ...state, status: 'gone', trigger: null, held: false, moved: false };
	}
}

/** @param {FlipState} state */
export const flipAttribute = (state) =>
	state.status === 'flipping' ? (state.trigger === 'hover' ? '' : 'requested') : null;
