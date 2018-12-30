# Copyright 2018 Charles R. Hogg III. All Rights Reserved.
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.// Utility functions for animated plots.

# All files in the 'lib' directory will be loaded
# before nanoc starts compiling.

include Nanoc::Helpers::LinkTo


# Links to extra assets (javascript and CSS) requested in the yaml header.
def extra_asset_links
  lines = []
  if item.attributes.has_key?(:css)
    for stylesheet in item.attributes[:css]
      lines.push("<link href='/assets/css/#{stylesheet}.css'"+
                 " type='text/css' rel='stylesheet'>")
    end
  end
  if item.attributes.has_key?(:js)
    for script in item.attributes[:js]
      lines.push("<script type='text/javascript'" +
                 " src='/assets/js/#{script}.js'></script>")
    end
  end
  lines.join("\n")
end


# Remove 
def index_name(id)
  id_without_index = (id.split('/') - ['index']).join('/')
  return id_without_index + '/index.html'
end
