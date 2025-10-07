export const categories = [
    { id: '1', name: 'Social Media', icon: 'logo-instagram', color: '#e91e63' },
    { id: '2', name: 'Shopping', icon: 'cart', color: '#ff9800' },
    { id: '3', name: 'Banking', icon: 'card', color: '#4caf50' },
    { id: '4', name: 'Entertainment', icon: 'play-circle', color: '#9c27b0' },
    { id: '5', name: 'Work', icon: 'briefcase', color: '#2196f3' },
    { id: '6', name: 'Education', icon: 'school', color: '#00bcd4' },
    { id: '7', name: 'Health', icon: 'fitness', color: '#f44336' },
    { id: '8', name: 'Other', icon: 'apps', color: '#607d8b' },
];

export const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id) || categories[7];
};

export const getCategoryColor = (categoryId: string) => {
    return getCategoryById(categoryId).color;
};