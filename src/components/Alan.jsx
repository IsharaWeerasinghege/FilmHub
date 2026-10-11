import {useContext, useEffect} from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import {ColorModeContext} from "../utils/ToggleColorMode";
import {fetchToken} from "../utils";
import {searchMovie, selectGenreOrCategory} from "../features/currentGenreOrCategory";
import {useDispatch} from "react-redux";

const useAlan = () => {
    const dispatch = useDispatch();
    const {setMode} = useContext(ColorModeContext)

    useEffect(() => {
        const alanKey = process.env.REACT_APP_ALAN_KEY;
        if (!alanKey) return;

        alanBtn({
            key: alanKey,
            onCommand: ({command, mode, genres, genreOrCategory, query}) => {
                if(command === 'chooseGenre'){
                    const foundGenre = genres.find((g) => g.name.toLowerCase() === genreOrCategory.toLowerCase());
                    if(foundGenre){
                        dispatch(selectGenreOrCategory(foundGenre.id))
                    } else {
                        const category = genreOrCategory.startsWith('top')? 'top_rated' : genreOrCategory;
                        dispatch(selectGenreOrCategory(category));
                    }
                } else
                if (command === 'changeMode') {
                    console.log('here', command , mode)

                    if(mode === 'light'){
                        setMode('light');
                    } else {
                        setMode('dark');
                    }
                } else  if(command === 'login'){
                    fetchToken();
                } else if(command === 'logout'){
                    localStorage.clear();
                    window.location.href = '/';
                } else if (command === 'search'){
                    dispatch(searchMovie(query));
                }
            }
        });
    }, []);
}

export default useAlan;