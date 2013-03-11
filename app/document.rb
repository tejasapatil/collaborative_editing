module CollaborativeEditing
    class Document
        # This class represent the document
        # its purpose is to manage the content,
        # its changes and its history
        
        attr_reader :name, :version, :rexml_doc
        
        def initialize(name)
            @name = name
            @version = 3 # HACK to be deleted later
            
            # server maintains all files under $COLLAB_EDITOR_HOME/data/
            # if file exists, then send its contents, else create a new file with default content
            if !File.file?("data/" + name + ".ver." + @version.to_s)
                # replicate the default file
                FileUtils.cp("app/default.file", "data/" + name + ".ver." + @version.to_s) 
            end
            @rexml_doc = REXML::Document.new(File.new("data/" + name + ".ver." + @version.to_s))          
        end
	
        def execute_change(change)
            puts "Parent: #{change.position.parent_node} - Child Num. #{change.position.child_number}"
            parent_node = REXML::XPath.first @rexml_doc, change.position.parent_node
            i = 0
            n = 0
            c = change.position.child_number.to_i
            while (i < c) do
                i +=1 if(parent_node.children[n].class == REXML::Text)
                n += 1
            end
            current_node = parent_node.children[n-1]
            current_node.value = current_node.value[0, change.position.y] + change.changes.to_s + current_node.value[change.position.y, current_node.value.length]
            puts "Changed node : " + current_node.value
            print @rexml_doc
            @version += 1
            File.open("data/" + name + ".ver." + @version.to_s, 'w') {|f| f.write(@rexml_doc) }
            puts "version changed to " + @version.to_s
        end
    end
end
