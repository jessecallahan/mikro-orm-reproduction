export const allowedActionIcon = (action) => {
    switch (action) {
        case "read.external":
           return '👁️'
        case "read.internal":
            return '🔒'
        case "create":
            return '➕'
        case "edit":
            return '✏️'
        case "delete":
            return '🗑️'
        case "export":
            return '🔽'
        default:
            return null
    }
}