const initialState = {
  user_id:null,
  username: "",
  user_img: "",
  is_creator: false,
  lobby_id: 0
};

const UPDATE_USER = "UPDATE_USER";
const LOGOUT = "LOGOUT";

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user_id: action.payload.user_id,
        username: action.payload.username,
        user_img: action.payload.user_img,
        is_creator: action.payload.is_creator,
        lobby_id: action.payload.lobby_id
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
