declare module "markdown-it" {
    namespace MarkdownIt {

    }

    class MarkdownIt {
        constructor(type: string);

        render(markdown: string): string;
    }

    export = MarkdownIt;
}