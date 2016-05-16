/// <reference path="./../../typings/main.d.ts" />

var highlighter: { initHighlightingOnLoad(): void; } = require("highlightjs/highlight.pack.js");

highlighter.initHighlightingOnLoad();

{
    //Server-rendered react views cannot wire up event listeners. 
    //This script will open a share window when clicking the share links on a blog post.
    var handleShare = (href: string, event: MouseEvent) =>
    {
        event.preventDefault();
        
        window.open(href, "share", 'width=550,height=250');  
    };
    
    var anchors = document.querySelectorAll(".share > a");
    
    for (var i = 0; i < anchors.length; i ++)
    {
        var anchor = anchors[i];
        
        anchor.addEventListener("click", handleShare.bind(anchor, anchor["href"]));
    }
}