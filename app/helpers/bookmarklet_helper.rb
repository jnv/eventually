module BookmarkletHelper
  def compile_invocation_script(url, options = {})
    default_error_message = "Something went wrong with the bookmarklet."
    error_message = options.has_key?(:error_message) ? options[:error_message] : default_error_message

    full_url = url
    if options.has_key?(:params)
      options[:params].each do |key,value|
        if !((full_url.ends_with? "?") || (full_url.ends_with? "&"))
          full_url += (full_url.include? "?") ? "&" : "?"
        end
        full_url += key + "=" + value
      end
    end

    return "javascript:(function(){var d=document,z=d.createElement('scr'+'ipt'),b=d.body;try{" +
      "if(!b)throw(0);z.setAttribute('src','" + full_url + "?r='+Math.random());b.appendChild(z);}" +
      "catch(e){alert('" + error_message + "');}}).call(this);"
  end
end
