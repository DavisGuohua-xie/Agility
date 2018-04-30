import Immutable from 'seamless-immutable';

export default Immutable({
    ajaxCallsInProgress: 0,
    authFormState: {
        username: "",
        password: "",
        email: ""
      },

      logging_in: false,
      logged_in: false,
      token: null,
});