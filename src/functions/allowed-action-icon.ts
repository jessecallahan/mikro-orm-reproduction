export const allowedActionIcon = (action: string) => {
    switch (action) {
        case "read.external":
           return '👁️'
        case "read.internal":
            return '🔒'
        case "create":
            return '➕'
        case "update":
            return '✏️'
        case "delete":
            return '🗑️'
        case "export":
            return '🔽'
        default:
            return null
    }
}