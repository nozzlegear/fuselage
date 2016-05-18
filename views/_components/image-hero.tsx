/// <reference path="./../../typings/main.d.ts" />

import * as React from "react";

export interface IProps extends React.Props<any>
{
    title: string;
}

export default function ImageHero(props: IProps)
{
    return (
        <section className="image-hero">
            <h1 className="image-hero-title">{props.title}</h1>
        </section>
    )
}