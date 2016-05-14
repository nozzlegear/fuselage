/// <reference path="./../typings/main.d.ts" />

import * as React from "react";
import {map, uniqueId} from "lodash";

export interface IProps extends React.Props<any>
{
    /**
     * Extra scripts that will be appended to the layout's body.
     */
    scripts?: string[];
}

export default function Scripts(props: IProps)
{
    const scripts = map(props.scripts, script => <script src={script} />)
    
    return (
        <div className="hide">
            {scripts}
            {props.children}  
        </div>
    )
}