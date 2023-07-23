import {Carousel} from "./components/Carousel";
import {Heros} from "./components/Heros";
import {LibraryServices} from "./components/LibraryServices";
import {ExploreTopBooks} from "./components/ExploreTopBooks";

export const HomePage = () => {
    return (
        <>
            <ExploreTopBooks/>
            <Carousel/>
            <Heros/>
            <LibraryServices/>
        </>
    );
};
