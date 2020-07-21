function initialState() {
    return {
        content: '',
        color: '',
        time: 0
    }
}

export default {
    state: initialState(),
    getters: {},
    mutations: {
        SET_NOTIFICATION(state, payload) {
            state.content = payload.content;
            state.color = payload.color;
            state.time = payload.time
        }
    },
    actions: {
        SHOW_NOTIFICATION: (context, payload) => {
            context.commit('SET_NOTIFICATION', payload);
        }
    }
}
