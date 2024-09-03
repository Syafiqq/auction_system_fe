const usdFormatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

const formatCurrency = (amount: number): string => usdFormatter.format(amount);

export {
    formatCurrency
};
