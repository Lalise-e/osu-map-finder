export default function ParseMysqlDate(mysql: string | null): Date | null{
    if(mysql == null)
        return null;
    const returnValue = new Date(Date.parse(mysql + ' UTC+0'));
    console.log(returnValue);
    return returnValue;
}