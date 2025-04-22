export function parseMode(mode: number): string{
    switch(mode){
        case 0:
            return 'Standard';
        case 1:
            return 'Taiko';
        case 2:
            return 'Catch';
        case 3:
            return 'Mania';
        default:
            return 'Invalid mode';
    }
}