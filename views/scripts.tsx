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
    const scripts = map(props.scripts, script => <script key={uniqueId()} src={script} />)
    
    return (
        <div className="hide">
            <script src="/wwwroot/js/extra.js" />
            {scripts}
            {props.children}  
        </div>
    )
}