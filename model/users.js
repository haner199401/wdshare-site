var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    dataBase = require("../server/config.js").db,
    Factory,
    db;
    
db           = mongoose.connection;

// 请不要使用下面的 save 之后的方法，这些方法 mongoosee 有原生的，更好用。
Users = function(){
    "use strict";
    this.Schema = Schema;
    this.mongoose = mongoose;
    this.init();
};

Users.prototype = {
    constructor:Factory,
    init:function(){
        "use strict";
        this.createSchemas();
        this.createModel();
    },
    createSchemas : function(){
        "use strict";
        this.UserSchema = new this.Schema({
            email: {
                type:String,
                unique:true,
                index: true
            },
            username:{
                type:String,
                index: true
            },
            role:Number,
            password:String,
            age: Number,
            lastLoginTime: Number,
            lastLoginIp: String,
            regTime:Number,
            regIp : String,
            sex:Number,
            score:Number,
            regCode:String,
            isActive:Boolean,
            activeTime:Number,
            changeEmail:String,
            changeTimes:Number,
            lock:Boolean,
            lockTime:Number,
            lockMessage:String,
            vip:String
        });
        this.resetPassword = new this.Schema({
            email: {
                type:String,
                unique:true
            },
            resetCode:String,
            hash:String
        });

    },
    createModel : function(){
        "use strict";
        this.User     = this.mongoose.model('User',this.UserSchema);
        this.ResetPW  = this.mongoose.model('ResetPW',this.resetPassword);
    },
    /*
     * obj {}
     * {
     *   key : User/Thread/Page
     *   body:{}
     * }
     * */
    save:function(obj,success,fail){
        "use strict";
        var content = new this[obj.key](obj.body);
        content.save(function(err,doc){
            success && success(err,doc);
        });
    },
    /*
     * obj {}
     * {
     *   key : User/Thread/Page
     * }
     * */
    getAll : function(obj,callback){
        "use strict";
        var condition = obj.body || {};
        this[obj.key].find(condition).exec(function(err,doc){
            callback && callback(err,doc);
        });
    },
    
    /**
     * Person
      .find({ occupation: /host/ })
      .where('name.last').equals('Ghost')
      .where('age').gt(17).lt(66)
      .where('likes').in(['vaporizing', 'talking'])
      .limit(10)
      .sort('-occupation')
      .select('name occupation')
      .exec(callback);
     */
    getSort : function(obj,callback){
        "use strict";
        var condition = obj.body || {},
            start = (obj.pages.page - 1) * obj.pages.pagesize || 0;
        this[obj.key].find(condition).skip(start).limit(obj.pages.pagesize).sort('-'+obj.occupation).exec(function(err,doc){
            callback && callback(err,doc);
        });
    },
    getAllByConditions : function(obj,callback){
        "use strict";
        this[obj.key].find(obj.query,obj.fields,obj.options).exec(function(err,doc){
            callback && callback(err,doc);
        });
    },
    getOne : function(obj,callback){
        "use strict";
        this[obj.key].findOne(obj.body,function(err,doc){
            callback && callback(err,doc);
        });
    },
    update : function(conditions,obj,callback){
        "use strict";
        this[obj.key].update(conditions,{$set:obj.body},obj.option,function(err,num){
            callback && callback(err,num,obj.body);
        });
    },
    count:function(conditions,obj,callback){
        "use strict";
        this[obj.key].count(conditions,function(err,mount){
            callback && callback(err,mount);
        });
    },
    remove : function(obj,callback){
        "use strict";
        this[obj.key].remove(obj.body,function(err,doc){
            callback && callback(err,doc);
        });
    }
};

module.exports = Users;
