export enum USER_TYPES {
    ADMIN = 0,
    USER = 1,
    TECHNICAL = 2,
    WAREHOUSE = 3

};
export enum CONSTANTS_MAX {
    EMPLOYEE_ID_LEN = 10,
    NAME_LEN = 50,
    EMAIL_LEN = 100,
    FEEDBACK_LEN = 200,
    DEPARMENT_LEN = 20,
    CATEGORY_LEN = 20
}

export enum CONSTANTS_MIN {
    PASSWORD_LEN = 6,
    NAME_LEN = 5,
    DEPARMENT_LEN = 3,
    CATEGORY_LEN = 2

}
export enum PAGE_SIZE {
    PAGE_USER = 10,
    PAGE_LOCATION = 10,
    PAGE_CATEGORY = 10,
    PAGE_DEVICE = 10,
    PAGE_USAGE = 10,
    PAGE_MATERIAL = 10,
}
export enum DEVICE_STATUS {
    ACTIVE,
    INACTIVE,
    REPAIR,
    DECOMMISSIONED,
}