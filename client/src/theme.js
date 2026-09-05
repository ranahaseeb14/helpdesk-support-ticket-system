export const theme = {
    primary: '#1e1b4b',      // deep navy/indigo
    accent: '#6366f1',       // electric indigo/violet
    accentLight: '#818cf8',
    bgLight: '#f8fafc',      // soft off-white background
    border: '#e2e8f0',       // subtle border gray
    textMuted: '#64748b',    // slate gray text
}

// Status badges — low-saturation backgrounds, readable text
export const statusStyles = {
    'Open': { bg: '#fee2e2', text: '#991b1b' },
    'Assigned': { bg: '#e0e7ff', text: '#3730a3' },
    'In Progress': { bg: '#fef3c7', text: '#92400e' },
    'Resolved': { bg: '#dcfce7', text: '#166534' },
    'Closed': { bg: '#f1f5f9', text: '#475569' },
}

export const priorityStyles = {
    'Low': { bg: '#f1f5f9', text: '#475569' },
    'Medium': { bg: '#fef3c7', text: '#92400e' },
    'High': { bg: '#fee2e2', text: '#991b1b' },
}

export function getStatusStyle(status) {
    return statusStyles[status] || { bg: '#f1f5f9', text: '#475569' }
}

export function getPriorityStyle(priority) {
    return priorityStyles[priority] || { bg: '#f1f5f9', text: '#475569' }
}