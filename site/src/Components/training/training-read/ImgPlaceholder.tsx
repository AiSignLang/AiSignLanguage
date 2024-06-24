
interface IProp{
    picturePath: string
}
export default function ImgPlaceholder(prop: IProp){
    return <>
        <img width={600} src= {`./img/placeholders/${prop.picturePath}`} alt="study placeholder"/>
    </>
}