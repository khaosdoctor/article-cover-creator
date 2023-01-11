# Cover generator

> Simple utility for generating cover images for my [blog posts](https://blog.lsantos.dev)

# Summary


<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Cover generator](#cover-generator)
- [Summary](#summary)
- [Usage](#usage)
  - [As web API](#as-web-api)
  - [How it works](#how-it-works)
- [Customizing](#customizing)

<!-- /code_chunk_output -->

# Usage

## As web API

Clone the repository and run the following command:

```bash
$ deno cache --lock=deno.lock ./src/**/*.ts
```

Then, you can run `deno task start` to start the server. By default it runs on port 3000, but you can set the `PORT` variable to change that.


## How it works

The inner workings of the project are pretty simple. In general, this app is just a web server with a single URL that receives search parameters that follow the format described in [this file](./src/presentation/api/routes/blog/articles/validation.ts); this route responds with a png image. You can use the cover URLs as direct sources to `<img>` tags, which I wanted to do in the first place.

Internally, when a request is made to the server, in this version, I was able to remove the browser completely and just use [this nice little lib](https://github.com/vercel/satori#documentation) to generate the images, it's 95% faster and runs on any serverless provider. All the parameters are kept the same.

# Customizing

This project is not fully customizable yet; the roadmap would allow it to have more templates so you can choose which one you want to use. However, changing the default one is pretty easy; you need to change the `src/templates/article.ejs` file. However, there are some things you need to keep in mind when creating a template:

- The template is a TSX file, which means you can form any type of data before you send it to the template, like I do in the original template myself by loading the local images and converting them to base64. One thing to note is that the font is loaded as the API is requested, because it's a key parameter to the satori function, which loads and embeds the data into the generated image.
- For now, the validation part is hardcoded, which means it doesn't accept any other parameters. If you want to add more parameters, you need to change the [validation file](./src/presentation/api/routes/blog/articles/validation.ts) and the [template file](./src/templates/article.tsx) to accept it.
- The image is generated with a fixed size of 1440x732px as this is the default value for the images in my blog, so if you want to change it, you need to change both the template and [the api router](./src/presentation//api/api.ts) because this is the viewport size used as default.

Remember that, in the end, it's just HTML so you can generate the file however you want.
