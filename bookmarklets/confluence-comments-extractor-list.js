javascript: (function() {
    var a = document.querySelectorAll(".inline-comment-marker.valid, .comment-count-overlay");
    const output_xpath = '//*[@id="main"]';
    const resolved_comments_view_btn_xpath = '//*[@id="view-resolved-comments"]';
    const resolved_comments_close_btn_xpath = '//*[@id="resolved-dialog-close-button"]';

    var i = 0;
    var output_div = document.createElement('div');
    var heading_span = document.createElement('span');

    heading_span.innerHTML = "<h1>Inline Comments</h1>";
    output_div.appendChild(heading_span);

    if (a.length <= 0) {
        alert("No confluence comments found in this page...");
        return;
    }

    function process_resolved_comments(output_div) {
        /* Open Resolved Comments div */
        document.evaluate(resolved_comments_view_btn_xpath, document).iterateNext().click();

        setTimeout(function() {
            const resolved_comments_div_xpath = '//*[@id="ic-resolved-comment-dialog"]/div/div[2]';
            const resolved_comments_username_xpath = '//*[@id="ic-resolved-comment-dialog"]/div/div[2]/div[i]/div[1]/div[1]/a[2]';
            const resolved_comments_text_xpath = '//*[@id="ic-resolved-comment-dialog"]/div/div[2]/div[i]/div[1]/div[2]/div/blockquote';
            const resolved_comments_comment_xpath = '//*[@id="ic-resolved-comment-dialog"]/div/div[2]/div[i]/div[1]/div[2]/div/p';
            const resolved_comments_link_xpath = '//*[@id="ic-resolved-comment-dialog"]/div/div[2]/div[i]/div[1]/div[3]/ul';
            const resolved_comments_reply_div_xpath = '//*[@id="ic-resolved-comment-dialog"]/div/div[2]/div[i]/div[2]';
            const resolved_comments_reply_username_xpath = '//*[@id="ic-resolved-comment-dialog"]/div/div[2]/div[i]/div[2]/div[j]/div[1]/a[2]';
            const resolved_comments_reply_text_xpath = '//*[@id="ic-resolved-comment-dialog"]/div/div[2]/div[i]/div[2]/div[j]/div[2]/div';

            var resolved_comments_div = document.evaluate(resolved_comments_div_xpath, document).iterateNext();
            var resolved_comments_count = resolved_comments_div.children.length;
            var comment_count = i;

            for (i = 1; i <= resolved_comments_count; i++) {
                var username = document.evaluate(resolved_comments_username_xpath.replace(/\[i\]/g, "[" + i + "]"), document).iterateNext().textContent;
                var comment_text = document.evaluate(resolved_comments_text_xpath.replace(/\[i\]/g, "[" + i + "]"), document).iterateNext().outerHTML;
                var comment = document.evaluate(resolved_comments_comment_xpath.replace(/\[i\]/g, "[" + i + "]"), document).iterateNext().innerHTML; /* Can try with outerHTML also */
                var comment_link = document.evaluate(resolved_comments_link_xpath.replace(/\[i\]/g, "[" + i + "]"), document).iterateNext().lastElementChild.lastElementChild.getElementsByTagName("a")[0].href;

                var comment_div = document.createElement('div');
                comment_div.setAttribute('class', 'confluence-information-macro confluence-information-macro-information conf-macro output-block');
                comment_div.setAttribute('style', 'background-color:#ecfbf3;');
                comment_div.setAttribute('data-hasbody', 'true');

                comment_div_content = '<p class="title">' + 'Comment #' + (comment_count + 1) + ': Resolved</p>';
                comment_div_content += '<div class="confluence-information-macro-body">';
                comment_div_content += '<div style="margin:10px;"><span>' + comment_text + '</span>';
                comment_div_content += '<p><a style="cursor: pointer;" onclick="window.open(\'' + comment_link + '\');">Click here to view this comment</a></p></div>';
                comment_div_content += '<div style="margin:10px; margin-left:25px;"><p style="font-style:italic;">' + username + ':</p>';
                comment_div_content += '<div style="margin:4px; margin-left:20px;">' + comment + '</div></div>';

                var reply_count = 0;
                var reply_count_div = document.evaluate(resolved_comments_reply_div_xpath.replace(/\[i\]/g, "[" + i + "]"), document).iterateNext();
                if (reply_count_div && reply_count_div.children) {
                    reply_count = reply_count_div.children.length;
                }

                if (reply_count > 1) {
                    comment_div_content += '<div style="margin-left:25px; margin-top:10px;"><p style="font-weight:bold;">Replies:</p></div>';
                    for (let j = 1; j <= reply_count; j++) {
                        var reply_username = document.evaluate(resolved_comments_reply_username_xpath.replace(/\[i\]/g, "[" + i + "]").replace(/\[j\]/g, "[" + j + "]"), document).iterateNext().textContent;
                        var reply_comment = document.evaluate(resolved_comments_reply_text_xpath.replace(/\[i\]/g, "[" + i + "]").replace(/\[j\]/g, "[" + j + "]"), document).iterateNext().innerHTML;

                        if (j < reply_count) {
                            comment_div_content += '<div style="margin:10px; margin-left:50px; margin-bottom:30px;"><p style="font-style:italic;">' + reply_username + ':</p>';
                        } else {
                            comment_div_content += '<div style="margin:10px; margin-left:50px;"><p style="font-style:italic;">' + reply_username + ':</p>';
                        }
                        comment_div_content += '<div style="margin:4px; margin-left:20px;">' + reply_comment + '</div></div>';
                    }
                } else if (reply_count == 1) {
                    comment_div_content += '<div style="margin-left:25px; margin-top:10px;"><p style="font-weight:bold;">Replies:</p></div>';
                    var reply_username = document.evaluate(resolved_comments_reply_username_xpath.replace(/\[i\]/g, "[" + i + "]").replace(/\[j\]/g, ""), document).iterateNext().textContent;
                    var reply_comment = document.evaluate(resolved_comments_reply_text_xpath.replace(/\[i\]/g, "[" + i + "]").replace(/\[j\]/g, ""), document).iterateNext().innerHTML;

                    comment_div_content += '<div style="margin:10px; margin-left:50px;"><p style="font-style:italic;">' + reply_username + ':</p>';
                    comment_div_content += '<div style="margin:4px; margin-left:20px;">' + reply_comment + '</div></div>';
                }

                comment_div_content += '</div>';

                comment_div.innerHTML = comment_div_content;
                output_div.appendChild(comment_div);

                comment_count++;
            }

            /* Close Resolved Comments div */
            document.evaluate(resolved_comments_close_btn_xpath, document).iterateNext().click();

            var output_div_elem = document.evaluate(output_xpath, document).iterateNext();

            output_div_elem.appendChild(output_div);

            document.body.style.cursor = 'default';

            alert("Processed all inline comments !\n\nThe comments list has been added at the end of the page !!");
            window.location.href = '#comments-section';
        }, 1000);
    }

    function process_open_comments(output_div) {
        a[i].click();
        setTimeout(function() {
            const username_xpath = '//*[@id="content"]/div[9]/div/div[1]/div[3]/div[1]/a[2]';
            const comment_xpath = '//*[@id="content"]/div[9]/div/div[1]/div[3]/div[2]/div';
            const reply_container_xpath = '//*[@id="content"]/div[9]/div/div[2]/div';
            const reply_username_xpath = '//*[@id="content"]/div[9]/div/div[2]/div/div[x]/div[1]/a[2]';
            const reply_comment_xpath = '//*[@id="content"]/div[9]/div/div[2]/div/div[x]/div[2]/div';

            var username = document.evaluate(username_xpath, document).iterateNext().textContent;
            var comment = document.evaluate(comment_xpath, document).iterateNext().innerHTML;

            var comment_div = document.createElement('div');
            comment_div.setAttribute('class', 'confluence-information-macro confluence-information-macro-information conf-macro output-block');
            comment_div.setAttribute('data-hasbody', 'true');

            var exit = false;
            var elem = a[i];
            do {
                if (elem.tagName.toUpperCase().startsWith("H")) {
                    exit = true;
                } else if (elem.previousElementSibling) {
                    if (elem.previousElementSibling.tagName.toUpperCase().startsWith("H")) {
                        elem = elem.previousElementSibling;
                        exit = true;
                    } else {
                        elem = elem.previousElementSibling;
                    }
                } else {
                    elem = elem.parentElement;
                }
            } while (!exit);

            comment_div_content = '<p class="title">' + 'Comment #' + (i + 1) + ': Open</p>';
            comment_div_content += '<div class="confluence-information-macro-body">';
            comment_div_content += '<div style="margin:10px;"><span>' + a[i].outerHTML + '</span>';
            comment_div_content += '<p>Section: <a href="#' + elem.id + '">' + elem.innerHTML + '</a></p></div>';
            comment_div_content += '<div style="margin:10px; margin-left:25px;"><p style="font-style:italic;">' + username + ':</p>';
            comment_div_content += '<div style="margin:4px; margin-left:20px;">' + comment + '</div></div>';

            var replies = document.evaluate(reply_container_xpath, document).iterateNext().children.length;
            if (replies > 1) {
                comment_div_content += '<div style="margin-left:25px; margin-top:10px;"><p style="font-weight:bold;">Replies:</p></div>';
                for (let j = 1; j <= replies; j++) {
                    var reply_username = document.evaluate(reply_username_xpath.replace("[x]", "[" + j + "]"), document).iterateNext().textContent;
                    var reply_comment = document.evaluate(reply_comment_xpath.replace("[x]", "[" + j + "]"), document).iterateNext().innerHTML;

                    if (j < replies) {
                        comment_div_content += '<div style="margin:10px; margin-left:50px; margin-bottom:30px;"><p style="font-style:italic;">' + reply_username + ':</p>';
                    } else {
                        comment_div_content += '<div style="margin:10px; margin-left:50px;"><p style="font-style:italic;">' + reply_username + ':</p>';
                    }
                    comment_div_content += '<div style="margin:4px; margin-left:20px;">' + reply_comment + '</div></div>';
                }
            } else if (replies == 1) {
                comment_div_content += '<div style="margin-left:25px; margin-top:10px;"><p style="font-weight:bold;">Replies:</p></div>';
                var reply_username = document.evaluate(reply_username_xpath.replace("[x]", "[" + 1 + "]"), document).iterateNext().textContent;
                var reply_comment = document.evaluate(reply_comment_xpath.replace("[x]", "[" + 1 + "]"), document).iterateNext().innerHTML;

                comment_div_content += '<div style="margin:10px; margin-left:50px;"><p style="font-style:italic;">' + reply_username + ':</p>';
                comment_div_content += '<div style="margin:4px; margin-left:20px;">' + reply_comment + '</div></div>';
            }

            comment_div_content += '</div>';

            comment_div.innerHTML = comment_div_content;
            output_div.appendChild(comment_div);

            i++;

            if (i < a.length) {
                setTimeout(process_open_comments, 500, output_div);
            } else {
                try {
                    process_resolved_comments(output_div);
                } catch (e) {
                    document.body.style.cursor = 'default';
                    console.error(e);
                    /* Close Resolved Comments div */
                    document.evaluate(resolved_comments_close_btn_xpath, document).iterateNext().click();
                    alert("Processing failed !!!\n\n Please check browser's console for details...");
                }
            }
        }, 500);
    }

    try {
        document.body.style.cursor = 'progress';
        process_open_comments(output_div);
    } catch (e) {
        document.body.style.cursor = 'default';
        console.error(e);
        alert("Processing failed !!!\n\n Please check browser's console for details...");
    }
})()