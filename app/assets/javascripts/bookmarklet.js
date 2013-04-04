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

    function Mapper(data)
    {
        this.data = data;
        this.topLevel = document;

        this.selectors = {
            series: '',
            name: '',
            date: '',
            start: '',
            venue: '',
            description: '',
            end: ''
        };

        this.propFn = {};
    }
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
            propFn(target, value);
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
        this.mapSelectors();
    };

    function SrazyMapper(data)
    {
        proto(SrazyMapper.prototype).constructor.call(this, data);
        this.topLevel = document.querySelector('#frm-newForm,#frm-editForm');

        this.propFn = {
            description: function (target, value)
            {
                target.innerHTML = value;
            },
            venue: function (target, value)
            {
                target.value = value;
                target.dispatchEvent(createEvent('keyup'));
            }
        };

        this.selectors = {
            name: '[name=subtitle]',
            date: '[name=start],[name=end]', //2013-04-03
            start: '[name=start_time]',
            venue: '[name=venue]',

            // description: '[name=desc]', //Textarea
            end: '[name=end_time]'
        };
    }
    inheritPrototype(SrazyMapper, Mapper);
    /*SrazyMapper.prototype.mapData = function ()
    {
        this.mapSelectors();
    };*/

    // var Facebook = {
    //     name: '[name=title]',
    //     description: '[name=details]',
    //     venue: '[name=location]',
    //     date: '[name=dateIntlDisplay]', // 4/3/2013
    //     start: '[name=when_time_display_time]' // 7 pm
    //     //when_time = h * 60 * 60

    // };

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
