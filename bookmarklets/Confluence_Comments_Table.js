javascript: (function() {
    var a = document.querySelectorAll(".inline-comment-marker.valid, .comment-count-overlay");
    const output_xpath = '//*[@id="main"]';
    const resolved_comments_view_btn_xpath = '//*[@id="view-resolved-comments"]';
    const resolved_comments_close_btn_xpath = '//*[@id="resolved-dialog-close-button"]';

    var i = 0;
    var output_div = document.createElement('div');
    var heading_span = document.createElement('span');
    var columns = ["#", "Section/Heading", "Comment Text", "Comment Username", "Comment", "Replies", "Open/Resolved"];
    var table_div_content = "";

    heading_span.innerHTML = "<h1>Inline Comments</h1>";
    output_div.appendChild(heading_span);

    var table_div = document.createElement('div');
    table_div.setAttribute('class', 'table-wrap');

    table_div_content = '<table class="relative-table wrapped confluenceTable ite-marked-table ite-real-table tablesorter tablesorter-default custom-ite-table stickyTableHeaders" style="padding: 0px;" role="grid"><thead class="tableFloatingHeaderOriginal"><tr ite-row-number="0" role="row" class="tablesorter-headerRow">';

    for (var j = 0; j < columns.length; j++) {
        table_div_content += '<th style="text-align: left;" colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted custom-row" ite-col-number="[i]" data-column="[i]" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="off" aria-sort="none"><div class="tablesorter-header-inner">'.replace(/\[i\]/g, "[" + j + "]");
        table_div_content += columns[j] + '</div></th>';
    }

    table_div_content += '</tr></thead><tbody aria-live="polite" aria-relevant="all" class="ui-sortable">';

    if (a.length <= 0) {
        alert("No confluence comments found in this page...");
        return;
    }

    function process_resolved_comments(output_div, table_div, table_div_content) {
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
                var comment_text = document.evaluate(resolved_comments_text_xpath.replace(/\[i\]/g, "[" + i + "]"), document).iterateNext().innerHTML;
                var comment = document.evaluate(resolved_comments_comment_xpath.replace(/\[i\]/g, "[" + i + "]"), document).iterateNext().innerHTML; /* Can try with outerHTML also */
                var comment_link = document.evaluate(resolved_comments_link_xpath.replace(/\[i\]/g, "[" + i + "]"), document).iterateNext().lastElementChild.lastElementChild.getElementsByTagName("a")[0].href;

                var reply_count = 0;
                var reply_count_div = document.evaluate(resolved_comments_reply_div_xpath.replace(/\[i\]/g, "[" + i + "]"), document).iterateNext();
                if (reply_count_div && reply_count_div.children) {
                    reply_count = reply_count_div.children.length;
                }
                var reply_content = "";

                if (reply_count > 1) {
                    for (let j = 1; j <= reply_count; j++) {
                        var reply_username = document.evaluate(resolved_comments_reply_username_xpath.replace(/\[i\]/g, "[" + i + "]").replace(/\[j\]/g, "[" + j + "]"), document).iterateNext().textContent;
                        var reply_comment = document.evaluate(resolved_comments_reply_text_xpath.replace(/\[i\]/g, "[" + i + "]").replace(/\[j\]/g, "[" + j + "]"), document).iterateNext().innerHTML;

                        if (j < reply_count) {
                            reply_content += '<div style="margin-bottom:30px;"><p style="font-style:italic;">' + reply_username + ':</p>';
                        } else {
                            reply_content += '<div><p style="font-style:italic;">' + reply_username + ':</p>';
                        }
                        reply_content += '<div style="margin-top:4px;">' + reply_comment + '</div></div>';
                    }
                } else if (reply_count == 1) {
                    var reply_username = document.evaluate(resolved_comments_reply_username_xpath.replace(/\[i\]/g, "[" + i + "]").replace(/\[j\]/g, ""), document).iterateNext().textContent;
                    var reply_comment = document.evaluate(resolved_comments_reply_text_xpath.replace(/\[i\]/g, "[" + i + "]").replace(/\[j\]/g, ""), document).iterateNext().innerHTML;

                    reply_content += '<div><p style="font-style:italic;">' + reply_username + ':</p>';
                    reply_content += '<div style="margin-top:4px; margin-left:10px;">' + reply_comment + '</div></div>';
                }

                var j = 0;
                /* Col 1: # */
                if (i == 1) {
                    table_div_content += '<tr style="background-color:#ecfbf3; border-top-style:double;" ite-row-number="' + j + '" role="row">';
                } else {
                    table_div_content += '<tr style="background-color:#ecfbf3;" ite-row-number="' + j + '" role="row">';
                }

                table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
                table_div_content += (comment_count + 1) + '</td>';
                j++;

                /* Col 2: Heading */
                table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
                table_div_content += '<p><a style="cursor: pointer;" onclick="window.open(\'' + comment_link + '\');">Click here to view this comment</a></p></td>';
                j++;

                /* Col 3: Comment Text */
                table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
                table_div_content += '<span>' + comment_text + '</span></td>';
                j++;

                /* Col 4: Comment Username */
                table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
                table_div_content += username + '</td>';
                j++;

                /* Col 5: Comment */
                table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
                table_div_content += comment + '</td>';
                j++;

                /* Col 6: Replies */
                table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
                table_div_content += reply_content + '</td>';
                j++;

                /* Col 7: Open/Resolved */
                table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
                table_div_content += 'Resolved' + '</td>';
                j++;

                table_div_content += '</tr>';

                comment_count++;

            }

            /* Close Resolved Comments div */
            document.evaluate(resolved_comments_close_btn_xpath, document).iterateNext().click();

            table_div_content += '</tbody></table>';
            table_div.innerHTML = table_div_content;

            var output_div_elem = document.evaluate(output_xpath, document).iterateNext();

            output_div.appendChild(table_div);
            output_div_elem.appendChild(output_div);

            function selectElement(el) {
                var body = document.body,
                    range, sel;
                if (document.createRange && window.getSelection) {
                    range = document.createRange();
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    try {
                        range.selectNodeContents(el);
                        sel.addRange(range);
                    } catch (e) {
                        range.selectNode(el);
                        sel.addRange(range);
                    }
                } else if (body.createTextRange) {
                    range = body.createTextRange();
                    range.moveToElementText(el);
                    range.select();
                }
            }
            selectElement(table_div);
            document.body.style.cursor = 'default';

            alert("Processed all inline comments !\n\nThe comments table has been added at the end of the page and is selected so that you can copy to clipboard !!");
            window.location.href = '#comments-section';
        }, 1000);
    }

    function process_open_comments(output_div, table_div, table_div_content) {
        a[i].click();
        setTimeout(function() {
            const username_xpath = '//*[@id="content"]/div[9]/div/div[1]/div[3]/div[1]/a[2]';
            const comment_xpath = '//*[@id="content"]/div[9]/div/div[1]/div[3]/div[2]/div';
            const reply_container_xpath = '//*[@id="content"]/div[9]/div/div[2]/div';
            const reply_username_xpath = '//*[@id="content"]/div[9]/div/div[2]/div/div[x]/div[1]/a[2]';
            const reply_comment_xpath = '//*[@id="content"]/div[9]/div/div[2]/div/div[x]/div[2]/div';

            var username = document.evaluate(username_xpath, document).iterateNext().textContent;
            var comment = document.evaluate(comment_xpath, document).iterateNext().innerHTML;
            var reply_content = "";

            var replies = document.evaluate(reply_container_xpath, document).iterateNext().children.length;
            if (replies > 1) {
                for (let j = 1; j <= replies; j++) {
                    var reply_username = document.evaluate(reply_username_xpath.replace("[x]", "[" + j + "]"), document).iterateNext().textContent;
                    var reply_comment = document.evaluate(reply_comment_xpath.replace("[x]", "[" + j + "]"), document).iterateNext().innerHTML;

                    if (j < replies) {
                        reply_content += '<div style="margin-bottom:30px;"><p style="font-style:italic;">' + reply_username + ':</p>';
                    } else {
                        reply_content += '<div><p style="font-style:italic;">' + reply_username + ':</p>';
                    }
                    reply_content += '<div style="margin-top:4px; margin-left:10px;">' + reply_comment + '</div></div>';
                }
            } else if (replies == 1) {
                var reply_username = document.evaluate(reply_username_xpath.replace("[x]", "[" + 1 + "]"), document).iterateNext().textContent;
                var reply_comment = document.evaluate(reply_comment_xpath.replace("[x]", "[" + 1 + "]"), document).iterateNext().innerHTML;

                reply_content += '<div><p style="font-style:italic;">' + reply_username + ':</p>';
                reply_content += '<div style="margin-top:4px; margin-left:10px;">' + reply_comment + '</div></div>';
            }

            var exit = false;
            var elem = a[i];
            var text = "";
            do {
                if (elem.previousElementSibling) {
                    text += elem.previousElementSibling.tagName + " > ";
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

            var j = 0;

            /* Col 1: # */
            table_div_content += '<tr ite-row-number="' + j + '" role="row">';
            table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
            table_div_content += (i + 1) + '</td>';
            j++;

            /* Col 2: Heading */
            table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
            table_div_content += '<a href="#' + elem.id + '">' + elem.innerHTML + '</a></td>';
            j++;

            /* Col 3: Comment Text */
            table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
            table_div_content += '<span>' + a[i].innerHTML + '</span></td>';
            j++;

            /* Col 4: Comment Username */
            table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
            table_div_content += username + '</td>';
            j++;

            /* Col 5: Comment */
            table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
            table_div_content += comment + '</td>';
            j++;

            /* Col 6: Replies */
            table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
            table_div_content += reply_content + '</td>';
            j++;

            /* Col 7: Open/Resolved */
            table_div_content += '<td style="text-align: left;" colspan="1" class="confluenceTd custom-row" ite-col-number="' + j + '" data-row-index="' + i + '">';
            table_div_content += 'Open' + '</td>';
            j++;

            table_div_content += '</tr>';

            i++;

            if (i < a.length) {
                setTimeout(process_open_comments, 500, output_div, table_div, table_div_content);
            } else {
                try {
                    process_resolved_comments(output_div, table_div, table_div_content);
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
        process_open_comments(output_div, table_div, table_div_content);
    } catch (e) {
        document.body.style.cursor = 'default';
        console.error(e);
        alert("Processing failed !!!\n\n Please check browser's console for details...");
    }
})()