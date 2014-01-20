Options
=======

a lib to manage crazy options,很多库中，参数跟配置的管理很蛋疼。。


提供以下api

#Options.create

    var schema = 
    {
        count: { type: Number, required: true },
        id: { type: Array, required: true }
    }
    var opt = Options.create(schema);
    

#opt.get()

通过key得到某配置项


#opt.set()

类似jq,get一个set一堆，可以传入键值对也可以传入对象

#opt.extend(input)

处理用户输入的选项，类似jquery.extend,yui mix之类

#opt._val()

以对象方式获取配置对象

#opt.stringify

把配置对象拼装成querystring

#Options._error

处理错误，错误类型有 类型错误啊，长度错误啊，是否必选啊之类

#Options._event

这里内含有一个事件处理器。

当option内部的配置改变了，触发set事件。获取配置时触发get事件。



暂时先想到这么多了。es的keys seals之类有用就用上



