const initialState = {
  username: "",
  user_img: "",
};

const UPDATE_USER = "UPDATE_USER";
const LOGOUT = "LOGOUT";

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        setUsername: action.payload.username,
        profile_pic: action.payload.user_img,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export function updateUser(user) {
  return {
    type: UPDATE_USER,
    payload: user,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}
