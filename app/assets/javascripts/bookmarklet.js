function EventuallyBookmarklet(data, document, window)
{
    'use strict';
    // var Event = <%= @event.to_json %>

    function inheritPrototype(childObject, parentObject)
    {
        var copyOfParent = Object.create(parentObject.prototype);
        copyOfParent.constructor = childObject;
        childObject.prototype = copyOfParent;
    }
    var proto = Object.getPrototypeOf;

    function createEvent(type)
    {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(type, true, true);
        return evt;
    }

    function pad(num)
    {
        if (num < 10)
        {
            return '0' + num;
        }
        return '' + num;
    }

    function addMinutes(date, minutes)
    {
        return new Date(date.getTime() + minutes * 60000);
    }

    function Mapper(data)
    {
        this.data = Object.create(data);
        ['date', 'start'].forEach(function (prop, i, props)
        {
            var str = this.data[prop];
            this.data[prop] = new Date(str);
        }, this);

        this.data.end = addMinutes(this.data.start, this.data.length);
        this.data.end_date = this.data.end;

        this.topLevel = document;

        this.selectors = {
            series: '',
            name: '',
            date: '',
            start: '',
            venue: '',
            description: '',
            end: '',
            length: ''
        };

        this.propFn = {};
    }
    Mapper.prototype.setupForm = function ()
    {};
    Mapper.prototype.getDate = function (property)
    {
        return new Date(this.data[property]);
    };
    Mapper.prototype.getName = function ()
    {
        return this.data.name;
    };
    Mapper.prototype.getElement = function (selector)
    {
        return this.topLevel.querySelector(selector);
    };
    Mapper.prototype.setElement = function (selector, value, propFn)
    {
        var target = this.getElement(selector);
        if (!target)
        {
            console.log(selector + ' not found');
            return;
        }

        if (propFn)
        {
            console.log('using property function for ' + selector);
            propFn(target, value, this);
        }
        else
        {
            target.value = value;
        }
    };
    Mapper.prototype.mapSelectors = function ()
    {
        for (var property in this.selectors)
        {
            var value = this.data[property];
            var selector = this.selectors[property];
            var propFn = this.propFn[property];

            console.log('mapping ' + property);

            this.setElement(selector, value, propFn);
        }
    };
    Mapper.prototype.mapData = function ()
    {
        this.setupForm();
        this.mapSelectors();
    };

    function SrazyMapper(data)
    {
        proto(SrazyMapper.prototype).constructor.call(this, data);
        this.topLevel = document.querySelector('#frm-newForm,#frm-editForm');
        this.data.end_date = this.data.end;

        this.propFn = {
            description: function (target, value)
            {
                target.innerHTML = value;
            },
            venue: function (target, value)
            {
                target.value = value;
                target.dispatchEvent(createEvent('keyup'));
            },
            date: function (target, d, self)
            {
                target.value = self.formatDate(d);
            },
            end_date: function (target, d, self)
            {
                target.value = self.formatDate(d);
            },
            start: function (target, d, self)
            {
                target.value = self.formatTime(d);
            },
            end: function (target, d, self)
            {
                target.value = self.formatTime(d);
            },
            visitors: function (target)
            {
                target.checked = true;
            },
            visitors_avatars: function (target)
            {
                target.checked = true;
            }
        };

        this.selectors = {
            name: '[name=subtitle]',
            date: '[name=start]',
            end_date: '[name=end]',
            start: '[name=start_time]',
            venue: '[name=venue]',
            description: '[name=desc]', //Textarea
            end: '[name=end_time]',
            facebook_id: '[name=fbId]',
            visitors: '[name=visitors]',
            visitors_avatars: '[name=visitors_avatars]'
        };
    }
    inheritPrototype(SrazyMapper, Mapper);
    SrazyMapper.prototype.formatTime = function (d) // 19:00
    {
        var hour = d.getUTCHours();
        var minute = d.getUTCMinutes();
        return pad(hour) + ':' + pad(minute);
    };
    SrazyMapper.prototype.formatDate = function (d) //2013-04-18
    {
        var day = d.getUTCDate();
        var month = d.getUTCMonth() + 1;
        var year = d.getUTCFullYear();
        return year + '-' + pad(month) + '-' + pad(day);
    };

    function FacebookMapper(data)
    {
        proto(FacebookMapper.prototype).constructor.call(this, data);
        this.topLevel = document.querySelector('form .eventsCreate');

        this.propFn = {
            name: function (target, value, self)
            {
                target.value = self.getName();
            },
            description: function (target, value)
            {
                target.onkeydown();
                target.innerHTML = value;
                // target.dispatchEvent(createEvent('keyup'));
            },
            date: function (target, d, self)
            {
                target.value = self.formatDate(d);
            },
            venue: function (target, value)
            {
                target.value = value;
                target.dispatchEvent(createEvent('keydown'));
            },
            start: function (target, d, self)
            {
                target.value = d.getUTCHours() * 60 * 60;
            },
            end: function (target, d, self)
            {
                target.value = self.formatTime(d);
            },
            end_date: function (target, d, self)
            {
                target.value = self.formatDate(d);
            }
        };

        this.selectors = {
            name: '[name=title]',
            description: '[name=details]', //Textarea
            venue: '[name=location]',
            date: '[name=when_date]',
            start: '[name=when_time]' //when_time = h * 60 * 60
            // end: '[name=end_time]',
            // end_date: '[name=end]',
        };
    }
    inheritPrototype(FacebookMapper, Mapper);
    FacebookMapper.prototype.getName = function ()
    {
        return this.data.series + ': ' + this.data.name + ' (' + this.data.speaker + ')';
    };
    FacebookMapper.prototype.formatTime = function (d) // 19:00
    {
        var hour = d.getUTCHours();
        var minute = d.getUTCMinutes();
        return pad(hour) + ':' + pad(minute);
    };
    FacebookMapper.prototype.formatDate = function (d) //4/19/2013
    {
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        return month + '/' + day + '/' + year;
    };

    function GPlusMapper(data)
    {
        proto(GPlusMapper.prototype).constructor.call(this, data);
        this.topLevel = document.querySelector('.U-L-x');
        if(!this.topLevel)
        {
            console.log('topLevel selector not found');
        }

        this.propFn = {
            name: function (target, value, self)
            {
                target.value = self.getName();
                target.dispatchEvent(createEvent('input'));
            },
            date: function (target, d, self)
            {
                // console.log(target);
                target.value = self.formatDate(d);
                target.blur();
            },
            start: function (target, d, self)
            {
                target.value = self.formatTime(d);
                target.blur();
                // target.keyup();
            },
            end: function (target, d, self)
            {
                target.value = self.formatTime(d);
                target.blur();
            },
            end_date: function (target, d, self)
            {
                target.value = self.formatDate(d);
                target.blur();
            },
            venue: function (target, value)
            {
                target.value = value;
                target.focus();
                // target.dispatchEvent(createEvent('keyup'));
            },
            description: function (target, value)
            {
                target.innerHTML = value;
                // target.dispatchEvent(createEvent('keyup'));
            }
        };

        this.selectors = {
            name: '.OQa',
            date: '.lUa',
            start: '.EKa',
            end: '.DKa',
            end_date: '.cbu3Kb',
            venue: '.iVa',
            description: '.dva [role=textbox]' //Div
        };
    }
    inheritPrototype(GPlusMapper, Mapper);
    GPlusMapper.prototype.setupForm = function ()
    {
        this.clickEndTime();
    };
    GPlusMapper.prototype.getName = function ()
    {
        return this.data.series + ': ' + this.data.name + ' (' + this.data.speaker + ')';
    };
    GPlusMapper.prototype.formatTime = function (d) // 6:30 PM
    {
        var hour = d.getUTCHours();
        var minute = d.getUTCMinutes();
        var ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        return hour + ':' + pad(minute) + ' ' + ampm;
    };
    GPlusMapper.prototype.formatDate = function (d) //Thu, Apr 4, 2013
    {
        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var day = d.getUTCDate();
        var month = monthNames[d.getUTCMonth()];
        var year = d.getUTCFullYear();
        return month + ' ' + day + ', ' + year;
    };
    GPlusMapper.prototype.clickEndTime = function ()
    {
        this.topLevel.querySelector('.ad.cva').click();
        // return this.data.series + ': ' + this.data.name + ' (' + this.data.speaker + ')';
    };

    // var location = document.URL;
    var hostname = document.location.hostname;
    var DomainMapper;
    switch (hostname)
    {
        case 'srazy.info':
            DomainMapper = SrazyMapper;
            break;
        case 'www.facebook.com':
            DomainMapper = FacebookMapper;
            break;
        case 'plus.google.com':
            DomainMapper = GPlusMapper;
            break;
        default:
            window.alert('Unsupported domain: ' + hostname);
            return;
    }

    var mapper = new DomainMapper(data);
    mapper.mapData();

}
