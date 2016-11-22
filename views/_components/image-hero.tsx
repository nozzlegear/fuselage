import * as React from "react";
import { THEME_COLOR } from "../../modules/constants";

export interface IProps extends React.Props<any> {
    title: string;
}

export default function ImageHero(props: IProps) {
    return (
        <section className="image-hero" style={{ backgroundColor: THEME_COLOR }}>
            <h1 className="image-hero-title">{props.title}</h1>
        </section>
    )
}