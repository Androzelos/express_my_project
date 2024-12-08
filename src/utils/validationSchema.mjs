export const createUserValidationSchema = {
    username: {
        notEmpty: {
            errorMessage: "Username cannot be empty"
        },
        isString: {
            errorMessage: "Username has to be string"
        },
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: "Username has to be between 5 and 32 characters"
        }
    },
    password: {
        notEmpty: true
    },
    displayName: {
        notEmpty: true
    }
}

export const createTeamValidationSchema = {
    teamName: {
        notEmpty: true,
        isString: true
    },
    teamLeader: {
        notEmpty: true,
    },
    teamMembers: {
        notEmpty: true,
        isArray: true
    },
    teamProjects: {
        notEmpty: true,
        isArray: true
    }
}