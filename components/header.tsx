
interface HeaderProps {
    title:string,
    description:string
}

const Header = ({title, description}:HeaderProps) => {
    return ( 
        <div className="flex flex-col mb-10 text-white">
            <div className="text-3xl font-bold">{title}</div>
            <div className="text-white/80 text-sm">{description}</div>
        </div>
     );
}
 
export default Header;