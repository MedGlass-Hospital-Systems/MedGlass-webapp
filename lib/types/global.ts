import { Shift } from "./planning"

export type AppContextType = {
    planning : Shift[]|undefined;
    setPlanning : React.Dispatch<React.SetStateAction<Shift[]|undefined>>;
}