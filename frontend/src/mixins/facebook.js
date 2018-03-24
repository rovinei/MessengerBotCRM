export const facebookMixinsPromises = {
    checkLoginState: () => {
        return new Promise((resolve, reject) => {
            window.FB.getLoginStatus((response) => {
                response.status === 'connected' ? resolve(response) : reject(response);
            });
        });
    },
    login: () => {
        return new Promise((resolve, reject) => {
            window.FB.login((response) => {
                response.status === 'connected' ? resolve(response) : reject(response);
            });
        });
    },
    logout: () => {
        return new Promise((resolve, reject) => {
            window.FB.logout((response) => {
                response.authResponse ? resolve(response) : reject(response);
            });
        });
    },
    fetchUser: () => {
        return new Promise((resolve, reject) => {
            window.FB.api(
                '/me', 
                {fields: 'id, first_name, last_name, gender'},
                response => response.error ? reject(response) : resolve(response)
            );
        });
    }
}

export const Facebook = {
    doLogin() {
        this.setState({
            loading: true
        }, () => {
            facebookMixinsPromises.init()
                .then(
                    facebookMixinsPromises.checkLoginState,
                    error => { throw error; }
                )
                .then(
                    response => { 
                        this.setState({
                            fb: {
                                status: response.status
                            }
                        });
                    },
                    facebookMixinsPromises.login
                )
                .then(
                    facebookMixinsPromises.fetchUser,
                    error => { throw error; }
                )
                .then(
                    response => { 
                        this.setState({
                            loading: false, 
                            fb: {
                                data: response, 
                                status: 'connected'
                            }
                        }); 
                    },
                    error => { throw error; }
                )
                .catch((error) => { 
                    this.setState({
                        loading: false, 
                        fb: {
                            data: {}, 
                            status: 'unknown'
                        }
                    }); 
                    console.warn(error); 
                });
        });
    },
    doLogout() {
        this.setState({
            loading: true
        }, () => {
            facebookMixinsPromises.init()
                .then(
                    facebookMixinsPromises.checkLoginState,
                    error => { throw error; }
                )
                .then(
                    facebookMixinsPromises.logout,
                    error => { 
                        this.setState({
                            loading: false, 
                            fb: {
                                data: {}, 
                                status: 'unknown'
                            }
                        });  
                    }
                )
                .then(
                    response => { 
                        this.setState({
                            loading: false, 
                            fb: {
                                data: {}, 
                                status: 'unknown'
                            }
                        });  
                    },
                    error => { throw error; }
                )
                .catch(error => { 
                    this.setState({
                        loading: false, 
                        fb: {
                            data: {}, 
                            status: 'unknown'
                        }
                    }); 
                    console.warn(error); 
                });
        });
    },
    checkLoginStatus() {
        this.setState({
            loading: true
        }, () => {
            facebookMixinsPromises.init()
                .then(
                    facebookMixinsPromises.checkLoginState,
                    error => { throw error; }
                )
                .then(
                    response => { 
                        this.setState({
                            fb: {
                                status: response.status
                            }
                        });  
                    },
                    error => { throw error; }
                )
                .then(
                    facebookMixinsPromises.fetchUser,
                    error => { throw error; }
                )
                .then(
                    response => { 
                        this.setState({
                            loading: false, 
                            fb: {
                                data: response, 
                                status: 'connected'
                            }
                        });  
                    },
                    error => { throw error; }
                )
                .catch((error) => { 
                    this.setState({
                        loading: false, 
                        fb: {
                            data: {}, 
                            status: 'unknown'
                        }
                    }); 
                    console.warn(error); 
                });
        });
    }
};