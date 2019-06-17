import cssParser from 'css';

export default class Utils {
    static deepcopy(obj:any) {
        return JSON.parse(JSON.stringify(obj))
    }

    static loop(item:any, handle:Function) {
        const stack:any = [];
        const localLoop = (parent:any) => {
            handle(parent, stack);
            stack.push(parent);
            if (parent.children !== undefined) {
                parent.children.forEach((child:any)=> localLoop(child));
            }
            stack.pop();
        }
        localLoop(item)
    }

    static maxId(item:any) {
        let id = 0;
        Utils.loop(item, ((child:any)=> {
            if (id < child.id) {
                id = child.id;
            }
        }));
        return id;
    }

    static equal(a:any, b:any) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    static merge(a:any, b:any) {
        Object.keys(b).forEach(k=> {
            a[k] = b[k];
        });
        return a;
    }

    static transform(inputCssText:any) {
        const transformRules = (self:any, rules:any, result:any) => {
            rules.forEach((rule:any)=>{
                var obj:any = {};
                if (rule.type === 'media') {
                    var name = mediaNameGenerator(rule.media);
                    var media = result[name] = result[name] || {
                        "__expression__": rule.media
                    };
                    transformRules(self, rule.rules, media)
                } else if (rule.type === 'rule') {
                    rule.declarations.forEach((declaration:any)=> {
                        if (declaration.type === 'declaration') {
                            var cleanProperty = cleanPropertyName(declaration.property);
                            if (isNaN(declaration.value)) {
                                obj[cleanProperty] = declaration.value;
                            } else {
                                obj[cleanProperty] = Number(declaration.value);
                            }
                        }
                    });
                    rule.selectors.forEach((selector:any)=> {
                        var name = nameGenerator(selector.trim());
                        result[name] = obj;
                    });
                }
            });
        }

        const cleanPropertyName = (name:any) => {
            // turn things like 'align-items' into 'alignItems'
            name = name.replace(/(-.)/g, function(v:any) { return v[1].toUpperCase(); })

            return name;
        }

        const mediaNameGenerator = (name:any) => {
            return '@media ' + name;
        }

        const nameGenerator = (name:any) => {
            name = name.replace(/\s\s+/g, ' ');
            name = name.replace(/[^a-zA-Z0-9]/g, '_');
            name = name.replace(/^_+/g, '');
            name = name.replace(/_+$/g, '');

            return name;
        }

        if(!inputCssText) {
            throw new Error('missing css text to transform');
        }

        // If the input "css" doesn't wrap it with a css class (raw styles)
        // we need to wrap it with a style so the css parser doesn't choke.
        var bootstrapWithCssClass = false;
        if(inputCssText.indexOf("{") === -1) {
            bootstrapWithCssClass = true;
            inputCssText = `.bootstrapWithCssClass { ${inputCssText} }`;
        }

        var css:any = cssParser.parse(inputCssText);
        var result:any = {};
        transformRules(this, css.stylesheet.rules, result);

        // Don't expose the implementation detail of our wrapped css class.
        if(bootstrapWithCssClass) {
            result = result.bootstrapWithCssClass;
        }

        return result;
    }

    static search(list:Array<any>, check:Function):Array<any> {
        let target;
        let index;
        list.forEach((item, i)=> {
            if (check(item)) {
                target = item;
                index = i;
            }
        });
        return [target, index];
    }

    static toCapital(value:string) {
        return value[0].toUpperCase() + value.slice(1, value.length);
    }

    static countLetter(str:string, letter:string) {
        let cnt = 0;
        for(let i=0;i<str.length;i++) {
            if (str[i] === letter) cnt +=1;
        }
        return cnt;
    }

    static arrayMove(arr:Array<any>, old_index:number, new_index:number) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
    }
}
