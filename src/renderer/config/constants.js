const dev =  {
    KATALK_TOP_FOLDER_NAME: '카카오톡',
    MAX_RETAIN_MESSAGES: 1000,
    KATALK_MESSAGE_REGEXP:{
        'REGEXP_DATE': /^\d.*년\s*\d.*월\s*\d.*일.*/,
        'REGEXP_MESSAGE': /^(\[.*?\])\s?(\[.*?\])\s?((.|\n)*)/g
    },
    SOCKET_SERVER: 'https://autoeditdev.sbs.co.kr',
    EVENT_NEW_MESSAGES: 'post:newMessages',
    NEW_MESSAGE_TYPE: {
        "EQUAL":"1",
        "NEW_BOTTOM":"2",
        "EQUAL_SHIFT_BOTTOM":"3",
        "NEW_TOP":"4",
        "NEW_SHIFT_BOTTOM":"5",
        "NEW_TOP_AND_BOTTOM":"6",
        "NEW_JUMP_TO_BOTTOM":"7",
        "INITIAL":"99"
    }
}

const prd = {
    ...dev,
    SOCKET_SERVER: ''
}

export default process.env.NODE_ENV === 'development' ? dev:prd;
