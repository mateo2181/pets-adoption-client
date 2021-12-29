export function getAddressWithoutCountry(address: string) {
    const [city, province,,] = address.split(',');
    return `${city}, ${province}`; 
}