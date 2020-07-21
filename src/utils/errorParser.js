import store from '../store';

export default {
    parse(error) {
        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 404: {
                    store
                        .dispatch('SHOW_NOTIFICATION',
                            {
                                time: 3000,
                                content: 'Request failed (404), resources not found on the server',
                                color: 'error'
                            });
                    break;
                }
                case 500: {
                    store
                        .dispatch('SHOW_NOTIFICATION',
                            {
                                time: 3000,
                                content: 'This is rephrased 500 error message. Please try again later ',
                                color: 'error'
                            });
                    break;
                } default:
                    store
                        .dispatch('SHOW_NOTIFICATION',
                            {
                                time: 3000,
                                content: 'This is not identified error. Please try again later',
                                color: 'error'
                            });
            }

        }

    }
}
